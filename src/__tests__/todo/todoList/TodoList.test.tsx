import { render, screen } from "@testing-library/react";
import TodoList from "../../../todo/todoList/TodoList";
import { Todo } from "../../../todo/model/todo/Todo";
import { TODO_STATUS } from "../../../todo/model/filter/TodoStatus";

describe("Todoの件数による表示テスト", () => {
  const expectTexts: string[] = [
    "これは１つ目のTodoです",
    "This is a text in the second row",
  ];
  test.each`
    text
    ${expectTexts[0]}
    ${expectTexts[1]}
  `("Todoが１件で $text を表示すること", (text) => {
    const todos: Array<Todo> = [
      {
        id: "dummy",
        text: text.text,
        status: TODO_STATUS.ACTIVE,
      },
    ];
    render(<TodoList todos={todos} />);
    const todoTexts = screen.getAllByTestId("todo-text");
    expect(todoTexts).toHaveLength(1);
    expect(todoTexts[0].textContent).toBe(text.text);
  });

  test("Todoが2件の場合の表示", () => {
    const todos: Array<Todo> = [
      {
        id: "dummy-1",
        text: expectTexts[0],
        status: TODO_STATUS.ACTIVE,
      },
      {
        id: "dummy-2",
        text: expectTexts[1],
        status: TODO_STATUS.ACTIVE,
      },
    ];
    render(<TodoList todos={todos} />);
    const todoTexts = screen.getAllByTestId("todo-text");
    expect(todoTexts).toHaveLength(2);
    todoTexts.forEach((todoText, index) => {
      expect(todoText.textContent).toBe(expectTexts[index]);
    });
  });

  test("Todoが0件ならリストは表示されない", () => {
    render(<TodoList todos={[]} />);
    const todoTexts = screen.queryByTestId("todo-text");
    expect(todoTexts).toBeNull();
  });
});
