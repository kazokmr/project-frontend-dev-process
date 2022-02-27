import { render, screen } from "@testing-library/react";
import RemainingTodos from "../../../todo/operating/RemainingTodos";

describe("TodoListの件数によるメッセージの違い", () => {
  test.each`
    numOfTodo | message
    ${1}      | ${"1 remain left"}
    ${2}      | ${"2 remains left"}
    ${0}      | ${"0 remain left"}
  `(
    "TodoListが $numOfTodo なら' $message 'と出力する",
    ({ numOfTodo, message }) => {
      render(<RemainingTodos numOfTodo={numOfTodo} />);
      expect(screen.getByText(message)).toBeInTheDocument();
    }
  );
});
