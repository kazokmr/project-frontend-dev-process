import { render, screen } from "@testing-library/react";
import TodoItem from "../../../todo/todoList/TodoItem";
import { TODO_COLOR, TodoColor } from "../../../todo/model/filter/TodoColors";
import { capitalize } from "../../../todo/model/filter/StringCapitalization";
import userEvent from "@testing-library/user-event";
import { Todo } from "../../../todo/model/todo/Todo";

const onChangeComplete: jest.Mock = jest.fn();
const onChangeColor: jest.Mock = jest.fn();
const onClickDelete: jest.Mock = jest.fn();

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
            isCompleted: isCompleted,
            color: TODO_COLOR.None,
          }}
          onChangeColor={onChangeColor}
          onChangeComplete={onChangeComplete}
          onClickDelete={onClickDelete}
        />
      );
      const checkbox = screen.getByRole("checkbox", { checked: isCompleted });
      expect(checkbox).toBeInTheDocument();
    }
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
          onChangeColor={onChangeColor}
          onChangeComplete={onChangeComplete}
          onClickDelete={onClickDelete}
        />
      );
      const selectBox = screen.getByRole("option", { selected: true });
      expect(selectBox.textContent).toBe(displayValue);
    }
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
          text: text,
          isCompleted: false,
          color: TODO_COLOR.None,
        }}
        onChangeColor={onChangeColor}
        onChangeComplete={onChangeComplete}
        onClickDelete={onClickDelete}
      />
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
              id: id,
              text: "update isSelected",
              isCompleted: isCompleted,
              color: TODO_COLOR.None,
            }}
            onChangeColor={onChangeColor}
            onClickDelete={onClickDelete}
            onChangeComplete={onChangeComplete}
          />
        );

        // When: Todoの完了状況を変更する
        const user = userEvent.setup();
        const completeCheckbox = screen.getByRole("checkbox", {
          name: "todo-isCompleted",
        });
        await user.click(completeCheckbox);

        // Then: Todoを完了状況を更新する
        expect(onChangeComplete.mock.calls[0][0]).toBe(id);
        expect(onChangeComplete).toHaveBeenCalledTimes(1);
      }
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
        const id: string = "dummy-id";
        const todo: Todo = {
          id,
          text: "Colorタグの変更",
          isCompleted: false,
          color: TODO_COLOR.None,
        };
        render(
          <TodoItem
            todo={todo}
            onChangeColor={onChangeColor}
            onChangeComplete={onChangeComplete}
            onClickDelete={onClickDelete}
          />
        );

        // When: Colorタグを変更する
        const user = userEvent.setup();
        const selectBox = screen.getByLabelText("select-todo-color");
        await user.selectOptions(selectBox, changingColor);

        // Then: TodoのIDと変更するColorを渡して関数を1回呼び出すこと
        expect(onChangeColor.mock.calls[0]).toEqual([id, changingColor]);
        expect(onChangeColor).toHaveBeenCalledTimes(1);
      }
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
      render(
        <TodoItem
          todo={todo}
          onChangeColor={onChangeColor}
          onChangeComplete={onChangeComplete}
          onClickDelete={onClickDelete}
        />
      );

      // When: Todoの削除ボタンを押す
      const user = userEvent.setup();
      const deleteButton = screen.getByRole("button", { name: "delete-todo" });
      await user.click(deleteButton);

      // Then: TodoのIdを渡して関数を1回呼び出すこと
      expect(onClickDelete.mock.calls[0][0]).toBe(id);
      expect(onClickDelete).toHaveBeenCalledTimes(1);
    });
  });
});
