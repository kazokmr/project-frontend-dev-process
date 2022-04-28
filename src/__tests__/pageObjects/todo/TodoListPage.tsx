import { UserEvent } from "@testing-library/user-event/dist/types/setup";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import TodoApp from "../../../todo/TodoApp";
import userEvent from "@testing-library/user-event";
import { TodoColor, TodoColors } from "../../../todo/model/filter/TodoColors";
import { Todo } from "../../../todo/model/todo/Todo";
import { createMockedTodos, setMockedTodo } from "../../../mocks/handlers";
import { TODO_STATUS, TodoStatus } from "../../../todo/model/filter/TodoStatus";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";

export class TodoListPage {
  private readonly user: UserEvent;
  private readonly refTodos: Todo[];
  private filteredStatus: TodoStatus;
  private filteredColors: TodoColor[];

  private constructor(todos: Todo[]) {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: Infinity,
        },
      },
    });
    render(
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <TodoApp />
        </QueryClientProvider>
      </RecoilRoot>
    );
    this.user = userEvent.setup();
    this.refTodos = todos;
    this.filteredStatus = TODO_STATUS.ALL;
    this.filteredColors = [];
  }

  // コンストラクタを複数設定できないのでStaticイニシャライザを使う
  static printWithRandomTodos = async (
    numOfTodos: number
  ): Promise<TodoListPage> => {
    const todos = createMockedTodos(numOfTodos);
    setMockedTodo(todos);
    return await TodoListPage.createPage(todos);
  };

  static printWithDefaultTodos = async (
    numOfTodos: number
  ): Promise<TodoListPage> => {
    const todos = createMockedTodos(numOfTodos, true, true);
    setMockedTodo(todos);
    return await TodoListPage.createPage(todos);
  };

  static printByTodos = async (initTodos: Todo[]): Promise<TodoListPage> => {
    setMockedTodo(initTodos);
    return await TodoListPage.createPage(initTodos);
  };

  private static createPage = async (todos: Todo[]): Promise<TodoListPage> => {
    const page = new TodoListPage(todos);
    await page.waitPrintTodos(todos.length);
    await waitFor(async () =>
      expect(await page.countTodos()).toBe(todos.length)
    );
    return page;
  };

  waitPrintTodos = async (numOfTodos: number) => {
    if (numOfTodos === 0) return;
    expect(await screen.findAllByTestId("content-todo")).toHaveLength(
      numOfTodos
    );
  };

  writeTodo = async (inputText: string): Promise<void> => {
    const todoTextBox = await screen.findByRole("textbox", {
      name: "input-todo",
    });
    await this.user.click(todoTextBox);
    await this.user.keyboard(inputText);
    await this.user.keyboard("[Enter]");
    // 入力したTodoが表示されるまで待つ
    expect(await screen.findByText(inputText)).toBeInTheDocument();
  };

  completeTodo = async (
    numberOfRow: number,
    isComplete: boolean
  ): Promise<void> => {
    const checkComplete = await this.getCompletedOfTodoByIndex(numberOfRow - 1);
    await this.user.click(checkComplete);
    // 完了状況が変わるまで待つ
    await waitFor(async () => {
      expect((await checkComplete).checked).toBe(isComplete);
    });
  };

  changeColor = async (
    numberOfRow: number,
    color: TodoColor
  ): Promise<void> => {
    const colorLabel = await this.getColorOfTodoByIndex(numberOfRow - 1);
    await this.user.selectOptions(colorLabel, color);
    // 色が変わるまで待つ
    await waitFor(async () => expect((await colorLabel).value).toBe(color));
    // ReFetchの完了を待つ(これが無いと画面の出力が完了する前にテストされてしまいエラーメッセージが出る)
    await this.waitReFetchTodos();
  };

  deleteTodo = async (numberOfRow: number): Promise<void> => {
    const deleteTodo = await this.getDeleteOfTodoByIndex(numberOfRow - 1);
    await this.user.click(deleteTodo);
    // Todoが削除されるまで待つ
    await waitForElementToBeRemoved(deleteTodo);
  };

  extractTodosByStatus = async (status: TodoStatus) => {
    // Pageオブジェクトの選択済みステータスを更新する
    this.filteredStatus = status;

    // Statusフィルタを変更する
    const activeFilter = await this.getStatusFilter(status);
    await this.user.click(activeFilter);

    // ボタンが押された状態になるまで待つ
    expect(
      await screen.findByRole("button", {
        name: new RegExp("^" + status + "$", "i"),
        pressed: true,
      })
    ).toBeInTheDocument();
    // TodoListの表示数が期待通りになるのを待つ
    await this.waitReFetchTodos();
  };

  extractTodosByColors = async (colors: TodoColor[]) => {
    // Pageオブジェクトの選択済みの色を更新する
    this.setFilteredColors(colors);

    // Colorフィルタの操作
    for (const color of colors) {
      const colorFilter = await this.getColorFilter(color);
      this.user.click(colorFilter);
    }

    // TodoListの表示数が期待通りになるのを待つ
    await this.waitReFetchTodos();
  };

  unExtractTodosByColors = async (colors: TodoColor[]) =>
    this.extractTodosByColors(colors);

  markAllCompleted = async () => {
    await this.user.click(
      await screen.findByRole("button", { name: "Mark All Completed" })
    );

    // 全ての完了チェックが付くまで待つ
    await waitFor(() => {
      const elements: HTMLInputElement[] = screen.queryAllByRole("checkbox", {
        name: "todo-isCompleted",
      });
      elements.forEach((value: HTMLInputElement) =>
        expect(value.checked).toBeTruthy()
      );
    });
  };

  clearCompleted = async () => {
    await this.user.click(
      await screen.findByRole("button", { name: "Clear Completed" })
    );

    // TodoListが未完了だけになるまで待つ
    await waitFor(async () => {
      const expectedCount = this.refTodos.filter(
        (todo: Todo) => !todo.isCompleted
      ).length;
      expect(await this.countTodos()).toBe(expectedCount);
    });
  };

  countTodos = async (): Promise<number> => {
    const data = await screen.findByLabelText("list-todo");
    return data ? data.childElementCount : 0;
  };

  isCompletedTodoByRow = async (numberOfRow: number): Promise<boolean> =>
    (await this.getCompletedOfTodoByIndex(numberOfRow - 1)).checked;

  getContentTodoByRow = async (numberOfRow: number): Promise<string | null> =>
    (await this.getContentOfTodoByIndex(numberOfRow - 1)).textContent;

  getColorOfTodoByRow = async (numberOfRow: number): Promise<string> =>
    (await this.getColorOfTodoByIndex(numberOfRow - 1)).value;

  isContentRemainingTodos = async (
    numOfUnCompleted: number
  ): Promise<boolean> => {
    const suffix = numOfUnCompleted > 1 ? "s" : "";
    const contentText = `${numOfUnCompleted} item${suffix} left`;
    const remainingTodo = await screen.findByTestId("remaining-todos");
    return remainingTodo.textContent === contentText;
  };

  isSelectedStatus = async (status: TodoStatus): Promise<boolean> => {
    const element = await this.getStatusFilter(status);
    return element.attributes.getNamedItem("aria-pressed")?.value === "true";
  };

  private getCompletedOfTodoByIndex = async (
    index: number
  ): Promise<HTMLInputElement> => {
    const completedArray: HTMLInputElement[] = await screen.findAllByRole(
      "checkbox",
      {
        name: "todo-isCompleted",
      }
    );
    return completedArray[index];
  };

  private getContentOfTodoByIndex = async (
    index: number
  ): Promise<HTMLInputElement> => {
    const contents: HTMLInputElement[] = await screen.findAllByTestId(
      "content-todo"
    );
    return contents[index];
  };

  private getColorOfTodoByIndex = async (
    index: number
  ): Promise<HTMLSelectElement> => {
    const colorListBoxes: HTMLSelectElement[] = await screen.findAllByRole(
      "combobox",
      { name: "select-todo-color" }
    );
    return colorListBoxes[index];
  };

  private getDeleteOfTodoByIndex = async (
    index: number
  ): Promise<HTMLButtonElement> => {
    const buttons: HTMLButtonElement[] = await screen.findAllByRole("button", {
      name: "delete-todo",
    });
    return buttons[index];
  };

  private getStatusFilter = async (
    todoStatus: TodoStatus
  ): Promise<HTMLButtonElement> => {
    return await screen.findByRole("button", {
      name: new RegExp("^" + todoStatus + "$", "i"),
    });
  };

  private getColorFilter = async (
    color: TodoColor
  ): Promise<HTMLInputElement> => {
    return await screen.findByRole("checkbox", { name: color });
  };

  /// 今回の操作で選択状態となるColorフィルターをセットする
  private setFilteredColors = (operatedColors: TodoColor[]) =>
    (this.filteredColors = TodoColors.filter(
      (color: TodoColor) => color !== ""
    ).filter(
      (color: TodoColor) =>
        (this.filteredColors.includes(color) &&
          !operatedColors.includes(color)) ||
        (!this.filteredColors.includes(color) && operatedColors.includes(color))
    ));

  /// Todoリストのリフェッチが完了するの待つ
  private waitReFetchTodos = async (): Promise<void> => {
    // FIXME: テストケースにロジックが入っている。行いたいことは操作に対して画面が更新されたことを待つこと
    const filtered =
      this.filteredStatus === TODO_STATUS.ALL
        ? this.refTodos
        : this.refTodos.filter((todo: Todo) =>
            this.filteredStatus === TODO_STATUS.COMPLETED
              ? todo.isCompleted
              : !todo.isCompleted
          );
    const expectedNumOfTodos =
      this.filteredColors.length === 0
        ? filtered.length
        : filtered.filter((todo: Todo) =>
            this.filteredColors.includes(todo.color)
          ).length;

    await waitFor(async () => {
      expect(await this.countTodos()).toBe(expectedNumOfTodos);
    });
  };
}
