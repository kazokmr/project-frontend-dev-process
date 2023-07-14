/* eslint-disable jest/no-standalone-expect */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import TodoApp from "../../../todo/TodoApp";
import { TodoColor, TodoColors } from "../../../todo/model/filter/TodoColors";
import { Todo } from "../../../todo/model/todo/Todo";
import { createMockedTodos, setMockedTodo } from "../../../mocks/handlers";
import { TODO_STATUS, TodoStatus } from "../../../todo/model/filter/TodoStatus";

export class TodoListPage {
  private readonly user = userEvent.setup();

  private filteredStatus: TodoStatus;

  private filteredColors: TodoColor[];

  private constructor() {
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
      </RecoilRoot>,
    );
    this.filteredStatus = TODO_STATUS.ALL;
    this.filteredColors = [];
  }

  // コンストラクタを複数設定できないのでStaticイニシャライザを使う
  static printWithRandomTodos = async (
    numOfTodos: number,
  ): Promise<TodoListPage> => {
    const todos = createMockedTodos(numOfTodos);
    setMockedTodo(todos);
    return TodoListPage.createPage(todos);
  };

  static printWithDefaultTodos = async (
    numOfTodos: number,
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
    const page = new TodoListPage();
    await TodoListPage.waitPrintTodos(todos.length);
    await waitFor(async () =>
      expect(await TodoListPage.countTodos()).toBe(todos.length),
    );
    return page;
  };

  static waitPrintTodos = async (numOfTodos: number) => {
    if (numOfTodos === 0) return;
    expect(await screen.findAllByTestId("content-todo")).toHaveLength(
      numOfTodos,
    );
  };

  writeTodo = async (inputText: string): Promise<void> => {
    const todoTextBox = await screen.findByRole("textbox", {
      name: "input-todo",
    });
    await this.user.click(todoTextBox);
    await this.user.keyboard(inputText);
    await this.user.keyboard("[Enter]");
  };

  completeTodo = async (numberOfRow: number): Promise<void> => {
    const checkComplete = await TodoListPage.getCompletedOfTodoByIndex(
      numberOfRow - 1,
    );
    if (typeof checkComplete === "object") {
      await this.user.click(checkComplete);
    }
  };

  changeColor = async (
    numberOfRow: number,
    color: TodoColor,
  ): Promise<void> => {
    const colorLabel = await TodoListPage.getColorOfTodoByIndex(
      numberOfRow - 1,
    );
    if (typeof colorLabel === "object") {
      await this.user.selectOptions(colorLabel, color);
    }
  };

  deleteTodo = async (numberOfRow: number): Promise<void> => {
    const deleteTodo = await TodoListPage.getDeleteOfTodoByIndex(
      numberOfRow - 1,
    );
    if (typeof deleteTodo === "object") {
      await this.user.click(deleteTodo);
    }
  };

  extractTodosByStatus = async (status: TodoStatus) => {
    // Pageオブジェクトの選択済みステータスを更新する
    this.filteredStatus = status;

    // Statusフィルタを変更する
    const activeFilter = await TodoListPage.getStatusFilter(status);
    await this.user.click(activeFilter);
  };

  extractTodosByColors = async (colors: TodoColor[]) => {
    // Pageオブジェクトの選択済みの色を更新する
    this.setFilteredColors(colors);

    // Colorフィルタの操作
    const promises: Promise<void>[] = [];
    colors.forEach((color) =>
      promises.push(TodoListPage.clickColorFilter(color)),
    );
    await Promise.all(promises);
  };

  unExtractTodosByColors = async (colors: TodoColor[]) =>
    this.extractTodosByColors(colors);

  markAllCompleted = async () => {
    await this.user.click(
      await screen.findByRole("button", { name: "Mark All Completed" }),
    );
  };

  clearCompleted = async () => {
    await this.user.click(
      await screen.findByRole("button", { name: "Clear Completed" }),
    );
  };

  static countTodos = async (): Promise<number> => {
    const data = await screen.findByLabelText("list-todo");
    return data.childElementCount;
  };

  static isCompletedTodoByRow = async (
    numberOfRow: number,
  ): Promise<boolean> => {
    const color = await this.getCompletedOfTodoByIndex(numberOfRow - 1);
    switch (typeof color) {
      case "object":
        return color.checked;
      default:
        return false;
    }
  };

  static getContentTodoByRow = async (
    numberOfRow: number,
  ): Promise<string | null> => {
    const contentOfTodo = await this.getContentOfTodoByIndex(numberOfRow - 1);
    if (typeof contentOfTodo === "object") {
      return contentOfTodo.textContent;
    }
    return null;
  };

  static getColorOfTodoByRow = async (numberOfRow: number): Promise<string> => {
    const colorOfTodo = await TodoListPage.getColorOfTodoByIndex(
      numberOfRow - 1,
    );
    if (typeof colorOfTodo === "object") {
      return colorOfTodo.value;
    }
    return "";
  };

  static isContentRemainingTodos = async (
    numOfUnCompleted: number,
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
    index: number,
  ): Promise<HTMLInputElement | undefined> => {
    const completedArray: HTMLInputElement[] = await screen.findAllByRole(
      "checkbox",
      {
        name: "todo-isCompleted",
      },
    );
    return completedArray[index];
  };

  private static getContentOfTodoByIndex = async (
    index: number,
  ): Promise<HTMLInputElement | undefined> => {
    const contents: HTMLInputElement[] = await screen.findAllByTestId(
      "content-todo",
    );
    return contents[index];
  };

  private static getColorOfTodoByIndex = async (
    index: number,
  ): Promise<HTMLSelectElement | undefined> => {
    const colorListBoxes: HTMLSelectElement[] = await screen.findAllByRole(
      "combobox",
      { name: "select-todo-color" },
    );
    return colorListBoxes[index];
  };

  private static getDeleteOfTodoByIndex = async (
    index: number,
  ): Promise<HTMLButtonElement | undefined> => {
    const buttons: HTMLButtonElement[] = await screen.findAllByRole("button", {
      name: "delete-todo",
    });
    return buttons[index];
  };

  private static getStatusFilter = async (
    todoStatus: TodoStatus,
  ): Promise<HTMLInputElement> =>
    screen.findByRole("radio", {
      name: new RegExp(`^${todoStatus}$`, "i"),
    });

  private static clickColorFilter = async (color: TodoColor): Promise<void> => {
    const colorFilter = await screen.findByRole("checkbox", { name: color });
    await userEvent.click(colorFilter);
  };

  /// 今回の操作で選択状態となるColorフィルターをセットする
  private setFilteredColors = (operatedColors: TodoColor[]) => {
    this.filteredColors = TodoColors.filter(
      (color: TodoColor) => color !== "",
    ).filter(
      (color: TodoColor) =>
        (this.filteredColors.includes(color) &&
          !operatedColors.includes(color)) ||
        (!this.filteredColors.includes(color) &&
          operatedColors.includes(color)),
    );
  };
}
