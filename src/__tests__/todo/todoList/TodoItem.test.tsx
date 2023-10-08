/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoItem from "../../../todo/todoList/TodoItem";
import { TODO_COLOR, TodoColor } from "../../../todo/model/filter/TodoColors";
import { capitalize } from "../../../todo/model/filter/StringCapitalization";
import { Todo } from "../../../todo/model/todo/Todo";

// useTodoをMock化し、useMutationTodoAdded().mutateをモック関数で返す
const mockedMutateTodoCompleted: jest.Mock = jest.fn();
const mockedMutateTodoChangedColor: jest.Mock = jest.fn();
const mockedMutateTodoDeleted: jest.Mock = jest.fn();
jest.mock("../../../todo/hooks/useTodos", () => ({
  useMutationTodoCompleted: () => ({ mutate: mockedMutateTodoCompleted }),
  useMutationTodoChangedColor: () => ({ mutate: mockedMutateTodoChangedColor }),
  useMutationTodoDeleted: () => ({ mutate: mockedMutateTodoDeleted }),
}));

// Mockの情報をクリアする
beforeEach(() => {
  mockedMutateTodoCompleted.mockClear();
  mockedMutateTodoChangedColor.mockClear();
  mockedMutateTodoDeleted.mockClear();
});

describe("初期選択状態のテスト", () => {
  test.each`
    isCompleted
    ${false}
    ${true}
  `(
    "Todoのcompletedが $isCompleted であること",
    ({ isCompleted }: { isCompleted: boolean }) => {
      render(
        <TodoItem
          todo={{
            id: "dummy-id",
            text: "Test whether todo is checked or not",
            isCompleted,
            color: TODO_COLOR.None,
          }}
        />,
      );
      const checkbox = screen.getByRole("checkbox", { checked: isCompleted });
      expect(checkbox).toBeInTheDocument();
    },
  );

  test.each`
    todoColor            | displayValue
    ${TODO_COLOR.None}   | ${capitalize(TODO_COLOR.None)}
    ${TODO_COLOR.Green}  | ${capitalize(TODO_COLOR.Green)}
    ${TODO_COLOR.Purple} | ${capitalize(TODO_COLOR.Purple)}
    ${TODO_COLOR.Red}    | ${capitalize(TODO_COLOR.Red)}
    ${TODO_COLOR.Blue}   | ${capitalize(TODO_COLOR.Blue)}
    ${TODO_COLOR.Orange} | ${capitalize(TODO_COLOR.Orange)}
    ${undefined}         | ${""}
  `(
    "TodoColorが $todoColor なら SelectBoxは $displayValue が選択される",
    ({
      todoColor,
      displayValue,
    }: {
      todoColor: TodoColor;
      displayValue: string;
    }) => {
      render(
        <TodoItem
          todo={{
            id: "dummy-id",
            text: "Test SelectBox",
            isCompleted: false,
            color: todoColor,
          }}
        />,
      );
      const selectBox = screen.getByRole("option", { selected: true });
      expect(selectBox.textContent).toBe(displayValue);
    },
  );

  test.each`
    text
    ${"ABC"}
    ${"テスト"}
    ${"漢字試験"}
    ${""}
    ${" "}
    ${"　"}
  `("TodoText $text が表示される", ({ text }: { text: string }) => {
    render(
      <TodoItem
        todo={{
          id: "dummy-id",
          text,
          isCompleted: false,
          color: TODO_COLOR.None,
        }}
      />,
    );
    // getByTextだとスペースと空文字が特定できないのでtext表示エリアを指定してtextContentで比較する
    const textBox = screen.getByTestId("content-todo");
    expect(textBox.textContent).toBe(text);
  });
});

describe("Todoのイベントハンドラのテスト", () => {
  describe("Todoの完了状況の変更イベントのテスト", () => {
    test.each`
      isCompleted
      ${false}
      ${true}
    `(
      "Todoの完了状況が $isCompleted で チェックボックスをクリックするとonChangeCompleteHandler関数を呼ぶ",
      async ({ isCompleted }: { isCompleted: boolean }) => {
        // Given: Todoをレンダリング
        const id = "dummy-id";
        render(
          <TodoItem
            todo={{
              id,
              text: "update isSelected",
              isCompleted,
              color: TODO_COLOR.None,
            }}
          />,
        );

        // When: Todoの完了状況を変更する
        const user = userEvent.setup();
        const completeCheckbox = screen.getByRole("checkbox", {
          name: "todo-isCompleted",
        });
        await user.click(completeCheckbox);

        // Then: Todoを完了状況を更新する
        expect(mockedMutateTodoCompleted.mock.calls[0][0]).toStrictEqual({
          id,
        });
        expect(mockedMutateTodoCompleted).toHaveBeenCalledTimes(1);
      },
    );
  });
  describe("TodoのColorタグの変更イベントのテスト", () => {
    test.each`
      changingColor
      ${TODO_COLOR.None}
      ${TODO_COLOR.Blue}
      ${TODO_COLOR.Red}
      ${TODO_COLOR.Orange}
      ${TODO_COLOR.Purple}
      ${TODO_COLOR.Green}
    `(
      "Colorタグを $changingColor に変更したら onChangeColorHandler関数を呼ぶこと",
      async ({ changingColor }: { changingColor: TodoColor }) => {
        // Given: Todoコンポーネントをレンダリングする
        const id = "dummy-id";
        const todo: Todo = {
          id,
          text: "Colorタグの変更",
          isCompleted: false,
          color: TODO_COLOR.None,
        };
        render(<TodoItem todo={todo} />);

        // When: Colorタグを変更する
        const user = userEvent.setup();
        const selectBox = screen.getByLabelText("select-todo-color");
        await user.selectOptions(selectBox, changingColor);

        // Then: TodoのIDと変更するColorを渡して関数を1回呼び出すこと
        expect(mockedMutateTodoChangedColor.mock.calls[0][0]).toStrictEqual({
          id,
          color: changingColor,
        });
        expect(mockedMutateTodoChangedColor).toHaveBeenCalledTimes(1);
      },
    );
  });

  describe("Todoの削除イベントのテスト", () => {
    test("削除ボタンを押すと onClickDeleteHandler関数を実行すること", async () => {
      // Given: Todoコンポーネントを出力する
      const id = "dummy-id";
      const todo: Todo = {
        id,
        text: "削除ボタンの操作イベントをテストする",
        isCompleted: false,
        color: TODO_COLOR.None,
      };
      render(<TodoItem todo={todo} />);

      // When: Todoの削除ボタンを押す
      const user = userEvent.setup();
      const deleteButton = screen.getByRole("button", { name: "delete-todo" });
      await user.click(deleteButton);

      // Then: TodoのIdを渡して関数を1回呼び出すこと
      expect(mockedMutateTodoDeleted.mock.calls[0][0]).toStrictEqual({ id });
      expect(mockedMutateTodoDeleted).toHaveBeenCalledTimes(1);
    });
  });
});
