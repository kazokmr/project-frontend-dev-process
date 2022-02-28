import { TODO_STATUS } from "../../../todo/filter/TodoStatus";
import { render, screen } from "@testing-library/react";
import TodoItem from "../../../todo/todoList/TodoItem";
import { TODO_COLOR } from "../../../todo/filter/TodoColors";
import { capitalize } from "../../../todo/filter/StringCapitalization";

describe("初期選択状態のテスト", () => {
  test.each`
    todoStatus               | isChecked
    ${TODO_STATUS.ACTIVE}    | ${false}
    ${TODO_STATUS.COMPLETED} | ${true}
  `(
    "TodoStatusが $todoStatus なら checkedは $isChecked になる",
    ({ todoStatus, isChecked }) => {
      render(<TodoItem todoText={"Test TodoStatus"} todoStatus={todoStatus} />);
      const checkbox = screen.getByRole("checkbox", { checked: isChecked });
      expect(checkbox).toBeInTheDocument();
    }
  );

  test.each`
    todoColor            | displayValue
    ${TODO_COLOR.Green}  | ${capitalize(TODO_COLOR.Green)}
    ${TODO_COLOR.Purple} | ${capitalize(TODO_COLOR.Purple)}
    ${TODO_COLOR.Red}    | ${capitalize(TODO_COLOR.Red)}
    ${TODO_COLOR.Blue}   | ${capitalize(TODO_COLOR.Blue)}
    ${TODO_COLOR.Orange} | ${capitalize(TODO_COLOR.Orange)}
    ${undefined}         | ${""}
  `(
    "TodoColorが $todoColor なら SelectBoxは $displayValue が選択される",
    ({ todoColor, displayValue }) => {
      render(
        <TodoItem
          todoText={"Test SelectBox"}
          todoStatus={TODO_STATUS.ACTIVE}
          todoColor={todoColor}
        />
      );
      const selectBox = screen.getByRole("option", { selected: true });
      expect(selectBox.textContent).toBe(displayValue);
    }
  );
});

describe("Todoの表示", () => {
  test.each`
    text
    ${"ABC"}
    ${"テスト"}
    ${"漢字試験"}
    ${""}
    ${" "}
    ${"　"}
  `("TodoText $text が表示される", ({ text }) => {
    render(<TodoItem todoText={text} todoStatus={TODO_STATUS.ACTIVE} />);
    const textBox = screen.getByTestId("todo-text");
    expect(textBox.textContent).toBe(text);
  });
});
