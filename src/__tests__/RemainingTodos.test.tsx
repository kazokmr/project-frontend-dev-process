import { render, screen } from "@testing-library/react";
import RemainingTodos from "../todo/operating/RemainingTodos";

describe("TodoListの件数によるメッセージの違い", () => {
  test("TodoListが1件なら、'1 remain left' と出力する", () => {
    render(<RemainingTodos numOfTodo={1} />);
    expect(screen.getByText("1 remain left")).toBeInTheDocument();
  });
  test("TodoListが2件なら、'2 remains left' と出力する", () => {
    render(<RemainingTodos numOfTodo={2} />);
    expect(screen.getByText("2 remains left")).toBeInTheDocument();
  });
  test("TodoListが0件なら、'0 remain left' と出力する", () => {
    render(<RemainingTodos numOfTodo={0} />);
    expect(screen.getByText("0 remain left")).toBeInTheDocument();
  });
});
