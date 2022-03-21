import { UserEvent } from "@testing-library/user-event/dist/types/setup";
import { render, screen } from "@testing-library/react";
import TodoApp from "../../../todo/TodoApp";
import userEvent from "@testing-library/user-event";
import { TodoColor } from "../../../todo/model/filter/TodoColors";
import { server } from "../../../mocks/server";
import { Todo } from "../../../todo/model/todo/Todo";
import { rest } from "msw";
import { createMockedTodos } from "../../../mocks/handlers";
import { TodoStatus } from "../../../todo/model/filter/TodoStatus";
import { capitalize } from "../../../todo/model/filter/StringCapitalization";

export class TodoListPage {
  private readonly user: UserEvent;

  private constructor() {
    render(<TodoApp />);
    this.user = userEvent.setup();
  }

  // コンストラクタを複数設定できないのでStaticイニシャライザを使う
  static printWithRandomTodos = async (
    numOfTodos: number
  ): Promise<TodoListPage> => {
    const initTodos = createMockedTodos(numOfTodos);
    fetchInitialTodos(initTodos);
    const page = new TodoListPage();
    await page.waitPrintTodos(numOfTodos);
    return page;
  };

  static printWithDefaultTodos = async (
    numOfTodos: number
  ): Promise<TodoListPage> => {
    const initTodos = createMockedTodos(numOfTodos, true, true);
    fetchInitialTodos(initTodos);
    const page = new TodoListPage();
    await page.waitPrintTodos(numOfTodos);
    return page;
  };

  static printByTodos = async (initTodos: Todo[]): Promise<TodoListPage> => {
    fetchInitialTodos(initTodos);
    const page = new TodoListPage();
    await page.waitPrintTodos(initTodos.length);
    return page;
  };

  waitPrintTodos = async (numOfTodos: number) => {
    if (numOfTodos === 0) return;
    expect(await screen.findAllByLabelText("content-todo")).toHaveLength(
      numOfTodos
    );
  };

  writeTodo = async (inputText: string): Promise<void> => {
    const todoTextBox = screen.getByRole("textbox", { name: "input-todo" });
    await this.user.click(todoTextBox);
    await this.user.keyboard(inputText);
    await this.user.keyboard("[Enter]");
  };

  completeTodo = async (numberOfRow: number): Promise<void> => {
    const checkComplete = this.getCompletedOfTodoByIndex(numberOfRow - 1);
    await this.user.click(checkComplete);
  };

  changeColor = async (
    numberOfRow: number,
    color: TodoColor
  ): Promise<void> => {
    const colorLabel = this.getColorOfTodoByIndex(numberOfRow - 1);
    await this.user.selectOptions(colorLabel, color);
  };

  deleteTodo = async (numberOfRow: number): Promise<void> => {
    const deleteTodo = this.getDeleteOfTodoByIndex(numberOfRow - 1);
    await this.user.click(deleteTodo);
  };

  extractTodosByStatus = async (status: TodoStatus) => {
    const activeFilter = this.getStatusFilter(status);
    await this.user.click(activeFilter);
  };

  extractTodosByColors = async (colors: TodoColor[]) => {
    for (let color of colors) {
      const colorFilter = this.getColorFilter(color);
      await this.user.click(colorFilter);
    }
  };

  unExtractTodosByColors = async (colors: TodoColor[]) =>
    this.extractTodosByColors(colors);

  markAllCompleted = async () =>
    this.user.click(screen.getByRole("button", { name: "Mark All Completed" }));

  countTodos = (): number => {
    const data = screen.getByLabelText("list-todo");
    return data ? data.childElementCount : 0;
  };

  isCompletedTodoByRow = (numberOfRow: number): boolean =>
    this.getCompletedOfTodoByIndex(numberOfRow - 1).checked;

  getContentTodoByRow = (numberOfRow: number): string | null =>
    this.getContentOfTodoByIndex(numberOfRow - 1).textContent;

  getColorOfTodoByRow = (numberOfRow: number): string =>
    this.getColorOfTodoByIndex(numberOfRow - 1).value;

  isContentRemainingTodos = async (
    numOfUnCompleted: number
  ): Promise<boolean> => {
    const suffix = numOfUnCompleted > 1 ? "s" : "";
    const contentText = `${numOfUnCompleted} item${suffix} left`;
    return (await screen.findByText(contentText)) !== null;
  };

  isSelectedStatus = async (
    status: TodoStatus,
    isPressed: boolean
  ): Promise<boolean> =>
    (await screen.findByRole("button", {
      name: new RegExp("^" + status + "$", "i"),
      pressed: isPressed,
    })) !== null;

  private getCompletedOfTodoByIndex = (index: number): HTMLInputElement => {
    const completedArray: Array<HTMLInputElement> = screen.getAllByRole(
      "checkbox",
      { name: "todo-isCompleted" }
    );
    return completedArray[index];
  };

  private getContentOfTodoByIndex = (index: number): HTMLInputElement => {
    const contents: Array<HTMLInputElement> =
      screen.getAllByLabelText("content-todo");
    return contents[index];
  };

  private getColorOfTodoByIndex = (index: number): HTMLSelectElement => {
    const colorListBoxes: Array<HTMLSelectElement> = screen.getAllByRole(
      "combobox",
      { name: "select-todo-color" }
    );
    return colorListBoxes[index];
  };

  private getDeleteOfTodoByIndex = (index: number): HTMLButtonElement => {
    const buttons: Array<HTMLButtonElement> = screen.getAllByRole("button", {
      name: "delete-todo",
    });
    return buttons[index];
  };

  private getStatusFilter = (todoStatus: TodoStatus) => {
    return screen.getByRole("button", {
      name: new RegExp("^" + todoStatus + "$", "i"),
    });
  };

  private getColorFilter = (color: TodoColor) => {
    return screen.getByRole("checkbox", {
      name: capitalize(color),
    });
  };
}

const fetchInitialTodos = (todos: Todo[]) => {
  server.use(
    rest.get("/todos", (req, res, ctx) => {
      return res.once(ctx.json(todos));
    })
  );
};
