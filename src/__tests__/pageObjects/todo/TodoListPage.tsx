/* eslint-disable jest/no-standalone-expect */
import { UserEvent } from "@testing-library/user-event/dist/types/setup";
import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import TodoApp from "../../../todo/TodoApp";
import { TodoColor, TodoColors } from "../../../todo/model/filter/TodoColors";
import { Todo } from "../../../todo/model/todo/Todo";
import { createMockedTodos, setMockedTodo } from "../../../mocks/handlers";
import { TODO_STATUS, TodoStatus } from "../../../todo/model/filter/TodoStatus";

export class TodoListPage {
  private readonly user: UserEvent;

  private readonly refTodos: Todo[];

  private filteredStatus: TodoStatus;

  private filteredColors: TodoColor[];

  private constructor(todos: Todo[]) {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: Infinity
        }
      }
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
    return TodoListPage.createPage(todos);
  };

  static printWithDefaultTodos = async (
    numOfTodos: number
  ): Promise<TodoListPage> => {
    const todos = createMockedTodos(numOfTodos, true, true);
    setMockedTodo(todos);
    return TodoListPage.createPage(todos);
  };

  static printByTodos = async (initTodos: Todo[]): Promise<TodoListPage> => {
    setMockedTodo(initTodos);
    return TodoListPage.createPage(initTodos);
  };

  private static createPage = async (todos: Todo[]): Promise<TodoListPage> => {
    const page = new TodoListPage(todos);
    await TodoListPage.waitPrintTodos(todos.length);
    await waitFor(async () =>
      expect(await TodoListPage.countTodos()).toBe(todos.length)
    );
    return page;
  };

  static waitPrintTodos = async (numOfTodos: number) => {
    if (numOfTodos === 0) return;
    expect(await screen.findAllByTestId("content-todo")).toHaveLength(
      numOfTodos
    );
  };

  writeTodo = async (inputText: string): Promise<void> => {
    const todoTextBox = await screen.findByRole("textbox", {
      name: "input-todo"
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
    const checkComplete = await TodoListPage.getCompletedOfTodoByIndex(numberOfRow - 1);
    await this.user.click(checkComplete);
    // 完了状況が変わるまで待つ
    await waitFor(() => {
      expect(checkComplete.checked).toBe(isComplete);
    });
  };

  changeColor = async (
    numberOfRow: number,
    color: TodoColor
  ): Promise<void> => {
    const colorLabel = await TodoListPage.getColorOfTodoByIndex(numberOfRow - 1);
    await this.user.selectOptions(colorLabel, color);
    // 色が変わるまで待つ
    await waitFor(() => expect(colorLabel.value).toBe(color));
    // ReFetchの完了を待つ(これが無いと画面の出力が完了する前にテストされてしまいエラーメッセージが出る)
    await this.waitReFetchTodos();
  };

  deleteTodo = async (numberOfRow: number): Promise<void> => {
    const deleteTodo = await TodoListPage.getDeleteOfTodoByIndex(numberOfRow - 1);
    await this.user.click(deleteTodo);
    // Todoが削除されるまで待つ
    await waitForElementToBeRemoved(deleteTodo);
  };

  extractTodosByStatus = async (status: TodoStatus) => {
    // Pageオブジェクトの選択済みステータスを更新する
    this.filteredStatus = status;

    // Statusフィルタを変更する
    const activeFilter = await TodoListPage.getStatusFilter(status);
    await this.user.click(activeFilter);

    // ボタンが押された状態になるまで待つ
    expect(
      await screen.findByRole("radio", {
        name: new RegExp(`^${  status  }$`, "i"),
        checked: true
      })
    ).toBeInTheDocument();
    // TodoListの表示数が期待通りになるのを待つ
    await this.waitReFetchTodos();
  };

  extractTodosByColors = async (colors: TodoColor[]) => {
    // Pageオブジェクトの選択済みの色を更新する
    this.setFilteredColors(colors);

    // Colorフィルタの操作
    const promises: Promise<void>[] = [];
    colors.forEach(color => promises.push(TodoListPage.clickColorFilter(color)));
    await Promise.all(promises);

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
        name: "todo-isCompleted"
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
      expect(await TodoListPage.countTodos()).toBe(expectedCount);
    });
  };

  static countTodos = async (): Promise<number> => {
    const data = await screen.findByLabelText("list-todo");
    return data.childElementCount;
  };

  static isCompletedTodoByRow = async (numberOfRow: number): Promise<boolean> =>
    (await this.getCompletedOfTodoByIndex(numberOfRow - 1)).checked;

  static getContentTodoByRow = async (numberOfRow: number): Promise<string | null> =>
    (await this.getContentOfTodoByIndex(numberOfRow - 1)).textContent;

  static getColorOfTodoByRow = async (numberOfRow: number): Promise<string> =>
    (await this.getColorOfTodoByIndex(numberOfRow - 1)).value;

  static isContentRemainingTodos = async (
    numOfUnCompleted: number
  ): Promise<boolean> => {
    const suffix = numOfUnCompleted > 1 ? "s" : "";
    const contentText = `${numOfUnCompleted} item${suffix} left`;
    const remainingTodo = await screen.findByTestId("remaining-todos");
    return remainingTodo.textContent === contentText;
  };

  static isSelectedStatus = async (status: TodoStatus): Promise<boolean> => {
    const element = await this.getStatusFilter(status);
    return element.checked;
  };

  private static getCompletedOfTodoByIndex = async (
    index: number
  ): Promise<HTMLInputElement> => {
    const completedArray: HTMLInputElement[] = await screen.findAllByRole(
      "checkbox",
      {
        name: "todo-isCompleted"
      }
    );
    return completedArray[index];
  };

  private static getContentOfTodoByIndex = async (
    index: number
  ): Promise<HTMLInputElement> => {
    const contents: HTMLInputElement[] = await screen.findAllByTestId(
      "content-todo"
    );
    return contents[index];
  };

  private static getColorOfTodoByIndex = async (
    index: number
  ): Promise<HTMLSelectElement> => {
    const colorListBoxes: HTMLSelectElement[] = await screen.findAllByRole(
      "combobox",
      { name: "select-todo-color" }
    );
    return colorListBoxes[index];
  };

  private static getDeleteOfTodoByIndex = async (
    index: number
  ): Promise<HTMLButtonElement> => {
    const buttons: HTMLButtonElement[] = await screen.findAllByRole("button", {
      name: "delete-todo"
    });
    return buttons[index];
  };

  private static getStatusFilter = async (
    todoStatus: TodoStatus
  ): Promise<HTMLInputElement> =>
    screen.findByRole("radio", {
      name: new RegExp(`^${  todoStatus  }$`, "i")
    });

  private static clickColorFilter = async (color: TodoColor): Promise<void> => {
    const colorFilter = await screen.findByRole("checkbox", { name: color });
    await userEvent.click(colorFilter);
  };

  /// 今回の操作で選択状態となるColorフィルターをセットする
  private setFilteredColors = (operatedColors: TodoColor[]) => {
    this.filteredColors = TodoColors.filter(
      (color: TodoColor) => color !== ""
    ).filter(
      (color: TodoColor) =>
        (this.filteredColors.includes(color) &&
          !operatedColors.includes(color)) ||
        (!this.filteredColors.includes(color) && operatedColors.includes(color))
    );
  };

  /// Todoリストのリフェッチが完了するの待つ
  private waitReFetchTodos = async (): Promise<void> => {
    // テストケースのフィルタに一致するデータ件数と一致することをWait条件にする(テストデータが動的なため件数が設定できないので)
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
      expect(await TodoListPage.countTodos()).toBe(expectedNumOfTodos);
    });
  };
}
