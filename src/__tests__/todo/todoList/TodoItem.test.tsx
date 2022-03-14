import { render, screen } from "@testing-library/react";
import TodoItem from "../../../todo/todoList/TodoItem";
import { TODO_COLOR, TodoColor } from "../../../todo/model/filter/TodoColors";
import { capitalize } from "../../../todo/model/filter/StringCapitalization";
import userEvent from "@testing-library/user-event";

const updateComplete: jest.Mock = jest.fn();

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
          updateComplete={updateComplete}
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
          updateComplete={updateComplete}
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
        updateComplete={updateComplete}
      />
    );
    // getByTextだとスペースと空文字が特定できないのでtext表示エリアを指定してtextContentで比較する
    const textBox = screen.getByLabelText("content-todo");
    expect(textBox.textContent).toBe(text);
  });
});

describe("Todoの完了状況が操作できること", () => {
  test.each`
    isCompleted | willBeCompletedAfterClick
    ${false}    | ${true}
    ${true}     | ${false}
  `(
    "Todoの完了状況が $isCompleted で チェックボックスをクリックすると $willBeCompletedAfterClick",
    async ({
      isCompleted,
    }: {
      isCompleted: boolean;
      willBeCompletedAfterClick: boolean;
    }) => {
      // Given: Todoをレンダリング
      const id = "dummy-id";
      render(
        <TodoItem
          todo={{
            id: id,
            text: "update isChecked",
            isCompleted: isCompleted,
            color: TODO_COLOR.None,
          }}
          updateComplete={updateComplete}
        />
      );

      // When: Todoの完了状況を変更する
      const user = userEvent.setup();
      const completeCheckbox = screen.getByRole("checkbox", {
        name: "todo-isCompleted",
      });
      await user.click(completeCheckbox);

      // Then: Todoを完了状況を更新する
      expect(updateComplete).toHaveBeenCalledTimes(1);
      expect(updateComplete.mock.calls[0][0]).toBe(id);
    }
  );
});
