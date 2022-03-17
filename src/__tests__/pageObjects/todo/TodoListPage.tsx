import { UserEvent } from "@testing-library/user-event/dist/types/setup";
import { render, screen } from "@testing-library/react";
import TodoApp from "../../../todo/TodoApp";
import userEvent from "@testing-library/user-event";
import { TodoColor } from "../../../todo/model/filter/TodoColors";

export class TodoListPage {
  private readonly user: UserEvent;
  private readonly todoTextBox: HTMLElement;

  private constructor() {
    render(<TodoApp />);
    this.user = userEvent.setup();
    this.todoTextBox = screen.getByRole("textbox", { name: "input-todo" });
  }

  // 初期Todoを設定するために非同期処理が必要だったので staticメソッドでインスタンスを生成するようにする
  static build = async (
    initNumberOfTodos: number = 0
  ): Promise<TodoListPage> => {
    const page = new TodoListPage();
    await page.setInitialTodo(initNumberOfTodos);
    return page;
  };

  inputNewTodo = async (inputText: string): Promise<void> => {
    await this.user.click(this.todoTextBox);
    await this.user.keyboard(inputText);
    await this.user.keyboard("[Enter]");
  };

  completeTodoByRow = async (numberOfRow: number): Promise<void> => {
    const checkComplete = this.getCompletedOfTodoByIndex(numberOfRow - 1);
    await this.user.click(checkComplete);
  };

  changeColorTagByRow = async (
    numberOfRow: number,
    color: TodoColor
  ): Promise<void> => {
    const colorLabel = this.getColorOfTodoByIndex(numberOfRow - 1);
    await this.user.selectOptions(colorLabel, color);
  };

  deleteTodoByRow = async (numberOfRow: number): Promise<void> => {
    const deleteTodo = this.getDeleteOfTodoByIndex(numberOfRow - 1);
    await this.user.click(deleteTodo);
  };

  numOfTodos = (): number => {
    const data = screen.queryByLabelText("list-todo");
    return data ? data.childElementCount : 0;
  };

  isCompletedTodoByRow = (numberOfRow: number): boolean =>
    this.getCompletedOfTodoByIndex(numberOfRow - 1).checked;

  getContentTodoByRow = (numberOfRow: number): string | null =>
    this.getContentOfTodoByIndex(numberOfRow - 1).textContent;

  getColorOfTodoByRow = (numberOfRow: number): string =>
    this.getColorOfTodoByIndex(numberOfRow - 1).value;

  private setInitialTodo = async (numberOfTodos: number) => {
    for (let number = 0; number < numberOfTodos; number++) {
      await this.inputNewTodo(`これは ${number + 1} のTodoです`);
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
