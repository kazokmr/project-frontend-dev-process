import { render, screen } from "@testing-library/react";
import StatusFilter from "../../../todo/operating/StatusFilter";
import { TODO_STATUS, TodoStatus } from "../../../todo/model/filter/TodoStatus";
import { capitalize } from "../../../todo/model/filter/StringCapitalization";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";

// QueryClientインスタンスは、retry:無効、staleTime:Infinity にしてセットしたテストデータキャッシュを更新しないようにする
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});

describe("ボタンの初期状態をテストする", () => {
  test.each`
    status                   | isAll    | isActive | isCompleted
    ${TODO_STATUS.ALL}       | ${true}  | ${false} | ${false}
    ${TODO_STATUS.ACTIVE}    | ${false} | ${true}  | ${false}
    ${TODO_STATUS.COMPLETED} | ${false} | ${false} | ${true}
    ${undefined}             | ${true}  | ${false} | ${false}
  `(
    "現在の検索状況が $curStatus なら、All: $isAll Active: $isActive Completed $isCompleted であること",
    async ({
      status,
      isAll,
      isActive,
      isCompleted,
    }: {
      status: TodoStatus;
      isAll: boolean;
      isActive: boolean;
      isCompleted: boolean;
    }) => {
      // Given: QueryClientインスタンスに初期値をセットしてコンポーネントを出力する
      queryClient.setQueryData(["status"], status);
      render(
        <QueryClientProvider client={queryClient}>
          <StatusFilter />
        </QueryClientProvider>
      );

      // When: Buttonを検索する
      const buttonAll = screen.getByRole("button", {
        name: capitalize(TODO_STATUS.ALL),
        pressed: isAll,
      });
      const buttonActive = screen.getByRole("button", {
        name: capitalize(TODO_STATUS.ACTIVE),
        pressed: isActive,
      });
      const buttonCompleted = screen.getByRole("button", {
        name: capitalize(TODO_STATUS.COMPLETED),
        pressed: isCompleted,
      });

      // Then: 設定されたStatusでボタンのPress状態が設定されていること
      expect(buttonAll).toBeInTheDocument();
      expect(buttonActive).toBeInTheDocument();
      expect(buttonCompleted).toBeInTheDocument();
    }
  );
});

describe("ボタンを押した時の動作を確認する", () => {
  test.each`
    filterName                           | status
    ${capitalize(TODO_STATUS.ALL)}       | ${TODO_STATUS.ALL}
    ${capitalize(TODO_STATUS.ACTIVE)}    | ${TODO_STATUS.ACTIVE}
    ${capitalize(TODO_STATUS.COMPLETED)} | ${TODO_STATUS.COMPLETED}
  `(
    "$filterNameボタンを押したら Statusの状態が $statusとなること",
    async ({
      filterName,
      status,
    }: {
      filterName: string;
      status: TodoStatus;
    }) => {
      // Given: QueryClientインスタンスに初期値をセットしてコンポーネントを出力する
      queryClient.setQueryData(["status"], status);
      render(
        <QueryClientProvider client={queryClient}>
          <StatusFilter />
        </QueryClientProvider>
      );

      // When: ボタンを押す
      const filter = screen.getByRole("button", { name: filterName });
      const user = userEvent.setup();
      await user.click(filter);
      const button = screen.getByRole("button", {
        name: filterName,
        pressed: true,
      });

      // Then: ボタンが押され、ステータスがセットされること
      expect(button).toBeInTheDocument();
      expect(queryClient.getQueryData(["status"])).toBe(status);
    }
  );
});
