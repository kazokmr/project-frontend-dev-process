import { QueryClient, QueryClientProvider } from "react-query";
import { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { useMutationTodoAdded, useQueryTodo } from "../../../todo/hooks/useTodo";
import { Todo } from "../../../todo/model/todo/Todo";
import { TODO_COLOR, TodoColor } from "../../../todo/model/filter/TodoColors";
import { server } from "../../../mocks/server";
import { DefaultRequestBody, PathParams, rest } from "msw";
import { TODO_STATUS, TodoStatus } from "../../../todo/model/filter/TodoStatus";

// QueryClientをテスト対象のカスタムHookをラップする
const queryClientWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("React QueryによるServerState管理", () => {
  beforeEach(() => {
    // Given: MSWでリクエストをインターセプトしてハンドリングする
    overrideHandler();
  });

  describe("useTodoQueryのテスト", () => {
    test("バックエンドAPIを使いTodoリストが取得できること", async () => {
      // When: 全てのTodoを検索する
      const { result, waitFor } = renderHook(() => useQueryTodo({}), {
        wrapper: queryClientWrapper(),
      });
      await waitFor(() => result.current.isSuccess);

      // Then: todoが取得できること
      expect(result.current.data).toHaveLength(7);
      expect(result.current.data).toEqual(mockTodos);
    });

    test.each`
      status                   | isCompleted | count
      ${TODO_STATUS.ACTIVE}    | ${false}    | ${4}
      ${TODO_STATUS.COMPLETED} | ${true}     | ${3}
    `(
      "Todoステータス'$status'でTodoリストを絞り込む",
      async ({
        status,
        isCompleted,
        count,
      }: {
        status: TodoStatus;
        isCompleted: boolean;
        count: number;
      }) => {
        // When: サーバーAPIをコールしてTodo配列をフェッチする
        const { result, waitFor } = renderHook(
          () =>
            useQueryTodo({
              status: status,
            }),
          {
            wrapper: queryClientWrapper(),
          }
        );
        await waitFor(() => result.current.isSuccess);

        // Then: todoが取得できること
        expect(result.current.data).toHaveLength(count);
        expect(result.current.data).toEqual(
          mockTodos.filter((todo) => todo.isCompleted === isCompleted)
        );
      }
    );
    test.each`
      colors                                                   | count
      ${[TODO_COLOR.Blue]}                                     | ${3}
      ${[TODO_COLOR.Red]}                                      | ${1}
      ${[TODO_COLOR.Purple]}                                   | ${0}
      ${[]}                                                    | ${7}
      ${[TODO_COLOR.Blue, TODO_COLOR.Green]}                   | ${5}
      ${[TODO_COLOR.Orange, TODO_COLOR.Green, TODO_COLOR.Red]} | ${3}
      ${[TODO_COLOR.Blue, TODO_COLOR.Green, TODO_COLOR.Red]}   | ${6}
      ${[TODO_COLOR.Purple, TODO_COLOR.Orange]}                | ${0}
    `(
      "Todoの色'$colors'でTodoリストを絞り込む",
      async ({ colors, count }: { colors: TodoColor[]; count: number }) => {
        // When: サーバーAPIをコールしてTodo配列をフェッチする
        const { result, waitFor } = renderHook(
          () =>
            useQueryTodo({
              colors: colors,
            }),
          {
            wrapper: queryClientWrapper(),
          }
        );
        await waitFor(() => result.current.isSuccess);

        // Then: todoが取得できること
        expect(result.current.data).toHaveLength(count);
        expect(result.current.data).toEqual(
          mockTodos.filter(
            (todo) => colors.length === 0 || colors.includes(todo.color)
          )
        );
      }
    );
    test.each`
      status                   | colors                                                 | count
      ${undefined}             | ${undefined}                                           | ${7}
      ${TODO_STATUS.ACTIVE}    | ${[TODO_COLOR.Blue]}                                   | ${2}
      ${TODO_STATUS.ACTIVE}    | ${[TODO_COLOR.Blue, TODO_COLOR.Red]}                   | ${2}
      ${TODO_STATUS.ACTIVE}    | ${[TODO_COLOR.Blue, TODO_COLOR.Red, TODO_COLOR.Green]} | ${4}
      ${TODO_STATUS.ACTIVE}    | ${[TODO_COLOR.Orange, TODO_COLOR.Purple]}              | ${0}
      ${TODO_STATUS.COMPLETED} | ${[TODO_COLOR.Blue]}                                   | ${1}
      ${TODO_STATUS.COMPLETED} | ${[TODO_COLOR.Blue, TODO_COLOR.Red]}                   | ${2}
      ${TODO_STATUS.COMPLETED} | ${[TODO_COLOR.Blue, TODO_COLOR.Red, TODO_COLOR.Green]} | ${2}
      ${TODO_STATUS.COMPLETED} | ${[TODO_COLOR.Orange, TODO_COLOR.Purple]}              | ${0}
    `(
      "Todoのステータス'$status' と 色 '$colors' を組み合わせると '$count' 件のTodoを検索する",
      async ({
        status,
        colors,
        count,
      }: {
        status?: TodoStatus;
        colors?: TodoColor[];
        count: number;
      }) => {
        // When: サーバーAPIをコールしてTodo配列をフェッチする
        const { result, waitFor } = renderHook(
          () =>
            useQueryTodo({
              status: status,
              colors: colors,
            }),
          {
            wrapper: queryClientWrapper(),
          }
        );
        await waitFor(() => result.current.isSuccess);

        // Then: todoが取得できること
        expect(result.current.data).toHaveLength(count);
      }
    );
  });
  describe("useMutationTodoのテスト", () => {
    test("Todoを追加するとTodoリストが再フェッチする", async () => {
      // Given: useQueryTodo と useMutationTodoAdded が参照するqueryClientを生成する
      const wrapper = queryClientWrapper();

      // カスタムHook useQueryTodoを出力しTodoリストをFetchする
      const { result: resultQuery, waitFor: waitForQuery } = renderHook(
        () => useQueryTodo({}),
        {
          wrapper: wrapper,
        }
      );
      await waitForQuery(() => resultQuery.current.isSuccess);
      // 最初は７件
      expect(resultQuery.current.data).toHaveLength(7);

      // When: useMutation カスタムHookを出力する
      const { result: resultMutation, waitFor: waitForMutation } = renderHook(
        () => useMutationTodoAdded(),
        {
          wrapper: wrapper,
        }
      );

      // mutateを実行して新しいTodoを実行する
      const text = "hogehoge";
      act(() => {
        resultMutation.current.mutate({ text });
      });
      await waitForMutation(() => resultMutation.current.isSuccess);

      // Then: queryデータが再FetchされTodoが追加される
      const todosAfterAdded: Todo[] = resultQuery.current.data as Todo[];
      expect(todosAfterAdded).toHaveLength(8);
      expect(todosAfterAdded[7].text).toBe(text);
      expect(todosAfterAdded[7].isCompleted).toBeFalsy();
      expect(todosAfterAdded[7].color).toBe(TODO_COLOR.None);
    });
  });
});

const overrideHandler = () => {
  server.use(
    rest.get<DefaultRequestBody, PathParams, Todo[]>(
      "/todos",
      (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockTodos));
      }
    ),
    rest.post<{ text: string }, PathParams, Todo>(
      "/todo",
      (req, res, context) => {
        const todo = new Todo(req.body.text);
        mockTodos = [...mockTodos, todo];
        return res(context.status(200), context.json(todo));
      }
    )
  );
};

let mockTodos: Todo[] = [
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
