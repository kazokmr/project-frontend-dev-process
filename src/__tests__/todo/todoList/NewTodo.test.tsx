import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewTodo from "../../../todo/todoList/NewTodo";

test("TextBoxに文字が入力できる", async () => {
  render(<NewTodo />);
  const textBox = screen.getByRole("textbox", { name: "input-todo" });
  const user = userEvent.setup();
  await user.click(textBox);
  await user.keyboard("abc");
  expect(textBox).toHaveValue("abc");
});
