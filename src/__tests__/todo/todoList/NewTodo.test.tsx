import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewTodo from "../../../todo/todoList/NewTodo";
import { UserEvent } from "@testing-library/user-event/dist/types/setup";

const addTodo = jest.fn() as jest.Mock;

test.each`
  text
  ${"This is a Todo!"}
  ${"これはTodoです"}
`("TextBoxに $text が入力できる", async ({ text }: { text: string }) => {
  // Given
  render(<NewTodo addTodo={addTodo} />);
  const user = userEvent.setup();
  const textBox = screen.getByRole("textbox", { name: "input-todo" });

  // When
  await typeTodo(user, textBox, text);

  // Then
  expect(textBox).toHaveValue(text);
});

describe("TextBoxに入力した文字列をTodoにセットする", () => {
  test.each`
    text
    ${"Create Todo"}
    ${"Todo　作成"}
  `(
    "Enterキーを押すとTextBoxに入力した $text を引数に関数を呼ぶ",
    async ({ text }: { text: string }) => {
      // Given: コンポーネントをレンダリングする
      render(<NewTodo addTodo={addTodo} />);
      const user = userEvent.setup();
      const textBox = screen.getByRole("textbox", { name: "input-todo" });

      // When：ユーザーがTodoを書いてエンターキーを押す
      await submitInputTodo(user, textBox, text);

      // Then: 入力した文字列をパラメータにcreateTodo関数が呼び出されること
      expect(addTodo).toHaveBeenCalledTimes(1);
      // 1回目の関数呼び出し時のパラメータが入力文字列であること
      expect(addTodo.mock.calls[0][0]).toBe(text);
      // Enterキーを押したらTextBoxの値はクリアされる
      expect(textBox).toHaveValue("");
    }
  );

  test("Enterを押さなければ関数は呼ばれずtextboxもクリアしない", async () => {
    // Given
    render(<NewTodo addTodo={addTodo} />);
    const user = userEvent.setup();
    const textBox = screen.getByRole("textbox", { name: "input-todo" });

    // When
    const text = "これはテストです。";
    await typeTodo(user, textBox, text);

    // Then
    expect(addTodo).not.toHaveBeenCalled();
    expect(textBox).toHaveValue(text);
  });
});

const typeTodo = async (
  user: UserEvent,
  textBox: HTMLElement,
  todoText: string
) => {
  await user.click(textBox);
  await user.keyboard(todoText);
};

const submitInputTodo = async (
  user: UserEvent,
  textBox: HTMLElement,
  todoText: string
) => {
  await user.click(textBox);
  await user.keyboard(todoText);
  await user.keyboard("[Enter]");
};
