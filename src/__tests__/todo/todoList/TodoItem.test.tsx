import { TODO_STATUS } from "../../../todo/filter/TodoStatus";
import { render, screen } from "@testing-library/react";
import TodoItem from "../../../todo/todoList/TodoItem";
import { COLOR } from "../../../todo/filter/Colors";
import { capitalize } from "../../../todo/filter/StringCapitalization";

describe("初期選択状態のテスト", () => {
  test.each`
    todoStatus               | isChecked
    ${TODO_STATUS.ACTIVE}    | ${false}
    ${TODO_STATUS.COMPLETED} | ${true}
  `(
    "TodoStatusが $todoStatus なら checkedは $isChecked になる",
    ({ todoStatus, isChecked }) => {
      render(<TodoItem todoStatus={todoStatus} />);
      const checkbox = screen.getByRole("checkbox", { checked: isChecked });
      expect(checkbox).toBeInTheDocument();
    }
  );

  test.each`
    todoColor       | displayValue
    ${COLOR.Green}  | ${capitalize(COLOR.Green)}
    ${COLOR.Purple} | ${capitalize(COLOR.Purple)}
    ${COLOR.Red}    | ${capitalize(COLOR.Red)}
    ${COLOR.Blue}   | ${capitalize(COLOR.Blue)}
    ${COLOR.Orange} | ${capitalize(COLOR.Orange)}
    ${undefined}    | ${""}
  `(
    "TodoColorが $todoColor なら selectboxは $displayValue が選択される",
    ({ todoColor, displayValue }) => {
      render(
        <TodoItem todoStatus={TODO_STATUS.ACTIVE} todoColor={todoColor} />
      );
      const selectBox = screen.getByRole("option", { selected: true });
      expect(selectBox.textContent).toBe(displayValue);
    }
  );
});
