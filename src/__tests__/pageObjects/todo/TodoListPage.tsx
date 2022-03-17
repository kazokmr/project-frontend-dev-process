import { UserEvent } from "@testing-library/user-event/dist/types/setup";
import { render, screen } from "@testing-library/react";
import TodoApp from "../../../todo/TodoApp";
import userEvent from "@testing-library/user-event";
import { TodoColor } from "../../../todo/model/filter/TodoColors";

export class TodoListPage {
  private readonly user: UserEvent;

  private constructor() {
    render(<TodoApp />);
    this.user = userEvent.setup();
  }

  // 初期Todoを設定するために非同期処理が必要だったので staticメソッドでインスタンスを生成するようにする
  static print = async (
    initNumberOfTodos: number = 0
  ): Promise<TodoListPage> => {
    const page = new TodoListPage();
    await page.initializeTodo(initNumberOfTodos);
    return page;
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

  countTodos = (): number => {
    const data = screen.queryByLabelText("list-todo");
    return data ? data.childElementCount : 0;
  };

  isCompletedTodoByRow = (numberOfRow: number): boolean =>
    this.getCompletedOfTodoByIndex(numberOfRow - 1).checked;

  getContentTodoByRow = (numberOfRow: number): string | null =>
    this.getContentOfTodoByIndex(numberOfRow - 1).textContent;

  getColorOfTodoByRow = (numberOfRow: number): string =>
    this.getColorOfTodoByIndex(numberOfRow - 1).value;

  private initializeTodo = async (numberOfTodos: number) => {
    for (let number = 0; number < numberOfTodos; number++) {
      await this.writeTodo(`これは ${number + 1} のTodoです`);
    }
  };

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
}
