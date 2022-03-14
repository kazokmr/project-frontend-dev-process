import { render, screen } from "@testing-library/react";
import TodoList from "../../../todo/todoList/TodoList";
import { Todo } from "../../../todo/model/todo/Todo";
import userEvent from "@testing-library/user-event";
import { TODO_COLOR } from "../../../todo/model/filter/TodoColors";

const updateComplete: jest.Mock = jest.fn();

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
        isCompleted: false,
        color: TODO_COLOR.None,
      },
    ];
    render(<TodoList todos={todos} updateComplete={updateComplete} />);
    const todoTexts = screen.getAllByLabelText("content-todo");
    expect(todoTexts).toHaveLength(1);
    expect(todoTexts[0].textContent).toBe(text);
  });

  test("Todoが2件の場合の表示", () => {
    const todos: Array<Todo> = [
      {
        id: "dummy-1",
        text: expectTexts[0],
        isCompleted: false,
        color: TODO_COLOR.None,
      },
      {
        id: "dummy-2",
        text: expectTexts[1],
        isCompleted: false,
        color: TODO_COLOR.None,
      },
    ];
    render(<TodoList todos={todos} updateComplete={updateComplete} />);
    const todoTexts = screen.getAllByLabelText("content-todo");
    expect(todoTexts).toHaveLength(2);
    todoTexts.forEach((todoText, index) => {
      expect(todoText.textContent).toBe(expectTexts[index]);
    });
  });

  test("Todoが0件ならリストは表示されない", () => {
    render(<TodoList todos={[]} updateComplete={updateComplete} />);
    const todoTexts = screen.queryAllByLabelText("content-todo");
    expect(todoTexts).toHaveLength(0);
  });
});

describe("Todoの状況を更新する", () => {
  test.each`
    isCompleted | willBeCompleted
    ${false}    | ${true}
    ${true}     | ${false}
  `(
    "完了状況が $isCompleted のTodoをクリックすると $willBeCompleted を呼び出すこと",
    async ({
      isCompleted,
    }: {
      isCompleted: boolean;
      willBeCompleted: boolean;
    }) => {
      // Given: Todoを１つ用意して表示する
      const id: string = "dummy-id";
      const todos: Todo[] = [
        {
          id,
          text: "完了チェックのテスト",
          isCompleted,
          color: TODO_COLOR.None,
        },
      ];
      render(<TodoList todos={todos} updateComplete={updateComplete} />);
      const user = userEvent.setup();
      const checkBox = screen.getAllByRole("checkbox", {
        name: "todo-isCompleted",
      })[0];

      // When:Todoの完了状況を更新する
      await user.click(checkBox);

      // Then: Todoの完了状況が更新されること
      expect(updateComplete).toHaveBeenCalledTimes(1);
      expect(updateComplete.mock.calls[0][0]).toBe(id);
    }
  );
});
