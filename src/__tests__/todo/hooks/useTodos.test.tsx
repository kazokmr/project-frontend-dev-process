import { QueryClient, QueryClientProvider } from "react-query";
import { ReactNode } from "react";
import { renderHook } from "@testing-library/react-hooks";
import { useTodos } from "../../../todo/hooks/useTodos";
import { Todo } from "../../../todo/model/todo/Todo";
import { TODO_COLOR } from "../../../todo/model/filter/TodoColors";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import { TODO_STATUS } from "../../../todo/model/filter/TodoStatus";

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useQueryのテスト", () => {
  test("バックエンドAPIでTodosを取得する", async () => {
    // Given: バックエンドAPIへのリクエストをインターセプト
    overrideHandler();

    // When: サーバーAPIをコールしてTodo配列をフェッチする
    const { result, waitFor } = renderHook(() => useTodos({}), {
      wrapper: createWrapper(),
    });
    await waitFor(() => result.current.isSuccess);

    // Then: todoが取得できること
    expect(result.current.data).toEqual(mockTodos);
  });

  test("statusで絞る", async () => {
    // Given: バックエンドAPIへのリクエストをインターセプト
    overrideHandler();

    // When: サーバーAPIをコールしてTodo配列をフェッチする
    const { result, waitFor } = renderHook(
      () =>
        useTodos({
          status: TODO_STATUS.COMPLETED,
        }),
      {
        wrapper: createWrapper(),
      }
    );
    await waitFor(() => result.current.isSuccess);

    // Then: todoが取得できること
    expect(result.current.data).toEqual(
      mockTodos.filter((todo) => todo.isCompleted)
    );
  });
});

const overrideHandler = () => {
  server.use(
    rest.get("/todos", (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(mockTodos));
    })
  );
};

const mockTodos: Todo[] = [
  {
    id: "1",
    text: "No.1",
    isCompleted: true,
    color: TODO_COLOR.Blue,
  },
  {
    id: "2",
    text: "No.2",
    isCompleted: true,
    color: TODO_COLOR.Red,
  },
  {
    id: "3",
    text: "No.3",
    isCompleted: false,
    color: TODO_COLOR.Blue,
  },
  {
    id: "4",
    text: "No.4",
    isCompleted: true,
    color: TODO_COLOR.None,
  },
  {
    id: "5",
    text: "No.5",
    isCompleted: false,
    color: TODO_COLOR.Blue,
  },
  {
    id: "6",
    text: "No.6",
    isCompleted: false,
    color: TODO_COLOR.Green,
  },
  {
    id: "7",
    text: "No.7",
    isCompleted: false,
    color: TODO_COLOR.Green,
  },
];
