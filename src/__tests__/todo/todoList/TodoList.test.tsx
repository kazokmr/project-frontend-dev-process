import { render, screen } from "@testing-library/react";
import TodoList from "../../../todo/todoList/TodoList";
import { Todo } from "../../../todo/model/todo/Todo";

describe("Todoの件数による表示テスト", () => {
  const expectTexts: string[] = [
    "これは１つ目のTodoです",
    "This is a text in the second row",
  ];
  test.each`
    text
    ${expectTexts[0]}
    ${expectTexts[1]}
  `("Todoが１件で $text を表示すること", ({ text }: { text: string }) => {
    const todos: Array<Todo> = [
      {
        id: "dummy",
        text: text,
      },
    ];
    render(<TodoList todos={todos} />);
    const todoTexts = screen.getAllByLabelText("content-todo");
    expect(todoTexts).toHaveLength(1);
    expect(todoTexts[0].textContent).toBe(text);
  });

  test("Todoが2件の場合の表示", () => {
    const todos: Array<Todo> = [
      {
        id: "dummy-1",
        text: expectTexts[0],
      },
      {
        id: "dummy-2",
        text: expectTexts[1],
      },
    ];
    render(<TodoList todos={todos} />);
    const todoTexts = screen.getAllByLabelText("content-todo");
    expect(todoTexts).toHaveLength(2);
    todoTexts.forEach((todoText, index) => {
      expect(todoText.textContent).toBe(expectTexts[index]);
    });
  });

  test("Todoが0件ならリストは表示されない", () => {
    render(<TodoList todos={[]} />);
    const todoTexts = screen.queryAllByLabelText("content-todo");
    expect(todoTexts).toHaveLength(0);
  });
});
