import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

test("Todoアプリ画面を表示する", () => {
  render(<App />);
  // やることの追加フォームの表示
  expect(screen.getByPlaceholderText(/やることを/)).toBeInTheDocument();
  // やることリストの表示
  expect(screen.getByText("todo")).toBeInTheDocument();
  // やることリストの操作エリアの表示
  const operationTitles = [
    "Actions",
    "Remaining Todos",
    "Filter by Status",
    "Filter by Color",
  ];
  screen.getAllByRole("heading", { level: 5 }).forEach((value, index) => {
    expect(value.textContent).toBe(operationTitles[index]);
  });
});
