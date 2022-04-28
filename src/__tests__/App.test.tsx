import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";

describe("Todoアプリ画面の初期レンダリング", () => {
  test("Todoアプリ画面を表示する", async () => {
    render(
      <RecoilRoot>
        <QueryClientProvider client={new QueryClient()}>
          <App />
        </QueryClientProvider>
      </RecoilRoot>
    );
    // やることの追加フォームの表示
    expect(
      await screen.findByRole("textbox", { name: "input-todo" })
    ).toBeInTheDocument();
    // やることリストの表示
    expect(
      await screen.findByRole("list", { name: "list-todo" })
    ).toBeInTheDocument();
    // やることリストの操作エリアの表示
    const operationTitles = [
      "Actions",
      "Remaining Todos",
      "Filter by Status",
      "Filter by Color",
    ];
    (await screen.findAllByRole("heading", { level: 6 })).forEach(
      (value, index) => {
        expect(value.textContent).toBe(operationTitles[index]);
      }
    );
  });
});
