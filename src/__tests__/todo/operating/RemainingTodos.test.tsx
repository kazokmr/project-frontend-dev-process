import { render, screen } from "@testing-library/react";
import RemainingTodos from "../../../todo/operating/RemainingTodos";

describe("TodoListの件数によるメッセージの違い", () => {
  test.each`
    numOfTodo | message
    ${1}      | ${"1 item left"}
    ${2}      | ${"2 items left"}
    ${0}      | ${"0 item left"}
  `(
    "TodoListが $numOfTodo なら' $message 'と出力する",
    ({ numOfTodo, message }: { numOfTodo: number; message: string }) => {
      render(<RemainingTodos numOfTodo={numOfTodo} />);
      expect(screen.getByText(message)).toBeInTheDocument();
    }
  );
});
