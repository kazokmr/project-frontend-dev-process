import { render, screen } from "@testing-library/react";
import TodoItem from "../../../todo/todoList/TodoItem";
import { TODO_COLOR } from "../../../todo/model/filter/TodoColors";
import { capitalize } from "../../../todo/model/filter/StringCapitalization";

describe("初期選択状態のテスト", () => {
  test.each`
    isCompleted
    ${false}
    ${true}
  `("Todoのcompletedが $isCompleted であること", ({ isCompleted }) => {
    render(
      <TodoItem
        id={"dummy-id"}
        text={"Test whether todo is checked or not"}
        isCompleted={isCompleted}
      />
    );
    const checkbox = screen.getByRole("checkbox", { checked: isCompleted });
    expect(checkbox).toBeInTheDocument();
  });

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
        <TodoItem id={"dummy-id"} text={"Test SelectBox"} color={todoColor} />
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
  `("TodoText $text が表示される", ({ text }) => {
    render(<TodoItem id={"dummy-id"} text={text} />);
    // getByTextだとスペースと空文字が特定できないのでtext表示エリアを指定してtextContentで比較する
    const textBox = screen.getByLabelText("content-todo");
    expect(textBox.textContent).toBe(text);
  });
});
