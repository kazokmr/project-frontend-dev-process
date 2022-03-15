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
  static build = async (initNumberOfTodos: number): Promise<TodoListPage> => {
    const page = new TodoListPage();
    await page.setInitialTodo(initNumberOfTodos);
    return page;
  };

  inputNewTodo = async (inputText: string): Promise<void> => {
    await this.user.click(this.todoTextBox);
    await this.user.keyboard(inputText);
    await this.user.keyboard("[Enter]");
  };

  numOfTodos = async (): Promise<number> => {
    const data = await screen.findByLabelText("list-todo");
    return data.childElementCount;
  };

  clickCompleteTodoByRow = async (numberOfRow: number): Promise<void> => {
    const checkComplete = await this.findCompletedOfTodoByIndex(
      numberOfRow - 1
    );
    await this.user.click(checkComplete);
  };

  selectColorLabelByRow = async (
    numberOfRow: number,
    color: TodoColor
  ): Promise<void> => {
    const colorLabel = await this.findColorOfTodoByIndex(numberOfRow - 1);
    await this.user.selectOptions(colorLabel, color);
  };

  isCompletedTodoByRow = (numberOfRow: number): Promise<boolean | null> => {
    return this.findCompletedOfTodoByIndex(numberOfRow - 1).then(
      (checkbox) => checkbox.checked
    );
  };

  getContentTodoByRow = (numberOfRow: number): Promise<string | null> => {
    return this.findContentOfTodoByIndex(numberOfRow - 1).then(
      (text) => text.textContent
    );
  };

  getColorOfTodoByRow = (numberOfRow: number): Promise<string | null> => {
    return this.findColorOfTodoByIndex(numberOfRow - 1).then(
      (select) => select.value
    );
  };

  private setInitialTodo = async (numberOfTodos: number) => {
    for (let number = 0; number < numberOfTodos; number++) {
      await this.inputNewTodo(`これは ${number + 1} のTodoです`);
    }
  };

  private findCompletedOfTodoByIndex = async (
    index: number
  ): Promise<HTMLInputElement> => {
    const completedArray: Array<HTMLInputElement> = await screen.findAllByRole(
      "checkbox",
      { name: "todo-isCompleted" }
    );
    return completedArray[index];
  };

  private findContentOfTodoByIndex = async (
    index: number
  ): Promise<HTMLInputElement> => {
    const contents: Array<HTMLInputElement> = await screen.findAllByLabelText(
      "content-todo"
    );
    return contents[index];
  };

  private findColorOfTodoByIndex = async (
    index: number
  ): Promise<HTMLSelectElement> => {
    const colorListBoxes: Array<HTMLSelectElement> = await screen.findAllByRole(
      "combobox",
      { name: "select-todo-color" }
    );
    return colorListBoxes[index];
  };

  private findDeleteOfTodoByIndex = async (
    index: number
  ): Promise<HTMLButtonElement> => {
    const buttons: Array<HTMLButtonElement> = await screen.findAllByRole(
      "button",
      { name: "delete-todo" }
    );
    return buttons[index];
  };
}
