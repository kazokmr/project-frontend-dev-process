import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewTodo from "../../../todo/todoList/NewTodo";
import { UserEvent } from "@testing-library/user-event/dist/types/setup";

const createTodo = jest.fn() as jest.Mock;

test("TextBoxに文字が入力できる", async () => {
  render(<NewTodo createTodo={createTodo} />);
  const user = userEvent.setup();
  const textBox = screen.getByRole("textbox", { name: "input-todo" });
  await inputKeyboard(user, textBox, "abc");
  expect(textBox).toHaveValue("abc");
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
      render(<NewTodo createTodo={createTodo} />);

      // When：ユーザーがTodoを書いてエンターキーを押す
      const user = userEvent.setup();
      const textBox = screen.getByRole("textbox", { name: "input-todo" });
      await inputKeyboard(user, textBox, text);
      await user.keyboard("[Enter>]");

      // Then: 入力した文字列をパラメータにcreateTodo関数が呼び出されること
      expect(createTodo).toHaveBeenCalledTimes(1);
      // 1回目の関数呼び出し時のパラメータが入力文字列であること
      expect(createTodo.mock.calls[0][0]).toBe(text);
      // Enterキーを押したらTextBoxの値はクリアされる
      expect(textBox).toHaveValue("");
    }
  );

  test("Enterを押さなければ関数は呼ばれずtextboxもクリアしない", async () => {
    // Given
    render(<NewTodo createTodo={createTodo} />);

    // When
    const user = userEvent.setup();
    const textBox = screen.getByRole("textbox", { name: "input-todo" });
    const expectedText = "moyomoyo";
    await inputKeyboard(user, textBox, expectedText);

    // Then
    expect(createTodo).not.toHaveBeenCalled();
    expect(textBox).toHaveValue(expectedText);
  });
});

async function inputKeyboard(
  user: UserEvent,
  textBox: HTMLElement,
  text: string
) {
  await user.click(textBox);
  await user.keyboard(text);
}
