import React from "react";
import { render } from "@testing-library/react";
import App from "../App";

test("renders learn react link", () => {
  const { container } = render(<App />);
  const element = container.querySelector("div[class='todo-container']");
  expect(element).toBeValid();
});
