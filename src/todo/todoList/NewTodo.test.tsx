import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewTodo from "./NewTodo";

const typeTodo = async (textBox: HTMLElement, todoText: string) => {
  const user = userEvent.setup();
  await user.click(textBox);
  await user.keyboard(todoText);
};

const submitInputTodo = async (textBox: HTMLElement, todoText: string) => {
  const user = userEvent.setup();
  await user.click(textBox);
  await user.keyboard(todoText);
  await user.keyboard("[Enter]");
};

// useTodoをMock化し、useMutationTodoAdded().mutateをモック関数で返す
const mockedMutate = vi.fn();
vi.mock("../hooks/useTodos", () => ({
  useMutationTodoAdded: () => ({ mutate: mockedMutate }),
}));

// mockに格納されている情報をクリアする
beforeEach(() => mockedMutate.mockClear());

test.each`
  text
  ${"This is a Todo!"}
  ${"これはTodoです"}
`("TextBoxに $text が入力できる", async ({ text }: { text: string }) => {
  // Given
  render(<NewTodo />);
  const textBox = screen.getByRole("textbox", { name: "input-todo" });

  // When
  await typeTodo(textBox, text);

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
      render(<NewTodo />);
      const textBox = screen.getByRole("textbox", { name: "input-todo" });

      // When：ユーザーがTodoを書いてエンターキーを押す
      await submitInputTodo(textBox, text);

      // Then: useMutation.mutate()を呼び出すこと。
      expect(mockedMutate).toHaveBeenCalledTimes(1);
      // useMutation.mutate()のパラメータに入力したテキストオブジェクトが渡される
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(mockedMutate.mock.calls[0][0]).toStrictEqual({ text });
      // Enterキーを押したらTextBoxの値はクリアされる
      expect(textBox).toHaveValue("");
    },
  );

  test("Enterを押さなければ関数は呼ばれずtextboxもクリアしない", async () => {
    // Given
    render(<NewTodo />);
    const textBox = screen.getByRole("textbox", { name: "input-todo" });

    // When
    const text = "これはテストです。";
    await typeTodo(textBox, text);

    // Then
    expect(mockedMutate).not.toHaveBeenCalled();
    expect(textBox).toHaveValue(text);
  });
});
