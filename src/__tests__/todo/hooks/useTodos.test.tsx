import { QueryClient, QueryClientProvider } from "react-query";
import { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import {
  useMutationTodoAdded,
  useMutationTodoColorChanged,
  useMutationTodoCompleted,
  useMutationTodoDeleted,
  useQueryTodo
} from "../../../todo/hooks/useTodo";
import { Todo } from "../../../todo/model/todo/Todo";
import { TODO_COLOR, TodoColor } from "../../../todo/model/filter/TodoColors";
import { TODO_STATUS, TodoStatus } from "../../../todo/model/filter/TodoStatus";
import { setMockedTodo } from "../../../mocks/handlers";

// Testデータ
let testTodos: Todo[] = [
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

// QueryClientをテスト対象のカスタムHookをラップする
const queryClientWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("React QueryによるServerState管理", () => {
  beforeEach(() => {
    // Given: MSWで利用するTodoデータを入れ替える
    setMockedTodo(testTodos);
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
      expect(result.current.data).toEqual(testTodos);
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
          testTodos.filter((todo) => todo.isCompleted === isCompleted)
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
          testTodos.filter(
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
    test("Todoを追加するとTodoリストを再フェッチする", async () => {
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

      // responseに含まれる追加されたTodoオブジェクトを確認する
      const addedTodo: Todo = resultMutation.current.data?.data;
      expect(addedTodo.text).toBe(text);
      expect(addedTodo.isCompleted).toBeFalsy();
      expect(addedTodo.color).toBe(TODO_COLOR.None);
    });
    test("指定したIDのTodoをCompletedにする", async () => {
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
      // 最初は未完了であることを確認する
      const todosBeforeMutation: Todo[] = resultQuery.current.data as Todo[];
      expect(todosBeforeMutation[2].isCompleted).toBeFalsy();

      // When: useMutation カスタムHookを出力する
      const { result: resultMutation, waitFor: waitForMutation } = renderHook(
        () => useMutationTodoCompleted(),
        {
          wrapper: wrapper,
        }
      );

      // mutateを実行して指定IDのTodoのCompleted状況を変更する
      act(() => {
        resultMutation.current.mutate({ id: "3" });
      });
      await waitForMutation(() => resultMutation.current.isSuccess);

      // Then: queryデータが再FetchされTodoの完了状況が更新される
      const todosAfterMutation: Todo[] = resultQuery.current.data as Todo[];
      expect(todosAfterMutation[2].text).toBe(todosBeforeMutation[2].text);
      expect(todosAfterMutation[2].isCompleted).not.toBe(
        todosBeforeMutation[2].isCompleted
      );
      expect(todosAfterMutation[2].color).toBe(todosBeforeMutation[2].color);
    });
  });
  test("指定したIDのTodoのColorを変更する", async () => {
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
    // 最初はRedであることを確認する
    const todosBeforeMutation: Todo[] = resultQuery.current.data as Todo[];
    expect(todosBeforeMutation[1].color).toBe(TODO_COLOR.Red);

    // When: useMutation カスタムHookを出力する
    const { result: resultMutation, waitFor: waitForMutation } = renderHook(
      () => useMutationTodoColorChanged(),
      {
        wrapper: wrapper,
      }
    );

    // mutateを実行してColorを変更する
    act(() => {
      resultMutation.current.mutate({ id: "2", color: TODO_COLOR.Purple });
    });
    await waitForMutation(() => resultMutation.current.isSuccess);

    // Then: queryデータが再FetchされTodoの完了状況が更新される
    const todosAfterMutation: Todo[] = resultQuery.current.data as Todo[];
    expect(todosAfterMutation[1].text).toBe(todosBeforeMutation[1].text);
    expect(todosAfterMutation[1].isCompleted).toBe(
      todosBeforeMutation[1].isCompleted
    );
    expect(todosAfterMutation[1].color).toBe(TODO_COLOR.Purple);
  });
  test("指定したIDのTodoをリストから削除する", async () => {
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
    // 最初は７件取得できる
    expect(resultQuery.current.data).toHaveLength(7);

    // When: useMutation カスタムHookを出力する
    const { result: resultMutation, waitFor: waitForMutation } = renderHook(
      () => useMutationTodoDeleted(),
      {
        wrapper: wrapper,
      }
    );

    // mutateを実行して指定したIDを削除する
    act(() => {
      resultMutation.current.mutate({ id: "4" });
    });
    await waitForMutation(() => resultMutation.current.isSuccess);

    // Then: queryデータが再FetchされTodoが６件になっていること
    const todos: Todo[] = resultQuery.current.data as Todo[];
    expect(todos).toHaveLength(6);
    expect(todos[2].id).toBe("3");
    expect(todos[3].id).toBe("5");
  });
});
