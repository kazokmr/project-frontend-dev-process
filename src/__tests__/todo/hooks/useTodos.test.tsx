import { QueryClient, QueryClientProvider } from "react-query";
import { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import {
  useMutationCompleteAllTodos,
  useMutationDeleteCompletedTodos,
  useMutationTodoAdded,
  useMutationTodoChangedColor,
  useMutationTodoCompleted,
  useMutationTodoDeleted,
  useQueryTodo
} from "../../../todo/hooks/useTodos";
import { Todo } from "../../../todo/model/todo/Todo";
import { TODO_COLOR } from "../../../todo/model/filter/TodoColors";
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
      const { result, waitFor } = renderHook(() => useQueryTodo(), {
        wrapper: queryClientWrapper(),
      });
      await waitFor(() => result.current.isSuccess);

      // Then: todoが取得できること
      expect(result.current.data).toHaveLength(7);
      expect(result.current.data).toEqual(testTodos);
    });
  });
  describe("useMutationTodoのテスト", () => {
    test("Todoを追加するとTodoリストを再フェッチする", async () => {
      // Given: useQueryTodo と useMutationTodoAdded が参照するqueryClientを生成する
      const wrapper = queryClientWrapper();

      // カスタムHook useQueryTodoを出力しTodoリストをFetchする
      const { result: resultQuery, waitFor: waitForQuery } = renderHook(
        () => useQueryTodo(),
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
      await waitForMutation(() => resultMutation.current.isSuccess, {
        timeout: 1500,
      });

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
        () => useQueryTodo(),
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
      await waitForMutation(() => resultMutation.current.isSuccess, {
        timeout: 1500,
      });

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
      () => useQueryTodo(),
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
      () => useMutationTodoChangedColor(),
      {
        wrapper: wrapper,
      }
    );

    // mutateを実行してColorを変更する
    act(() => {
      resultMutation.current.mutate({ id: "2", color: TODO_COLOR.Purple });
    });
    await waitForMutation(() => resultMutation.current.isSuccess, {
      timeout: 1500,
    });

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
      () => useQueryTodo(),
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
    await waitForMutation(() => resultMutation.current.isSuccess, {
      timeout: 1500,
    });

    // Then: queryデータが再FetchされTodoが６件になっていること
    const todos: Todo[] = resultQuery.current.data as Todo[];
    expect(todos).toHaveLength(6);
    expect(todos[2].id).toBe("3");
    expect(todos[3].id).toBe("5");
  });

  test("全てのTodoを完了済みにする", async () => {
    // Given: Todoリストを作成する
    const wrapper = queryClientWrapper();
    const { result: resultQuery, waitFor: waitForQuery } = renderHook(
      () => useQueryTodo(),
      {
        wrapper: wrapper,
      }
    );
    await waitForQuery(() => resultQuery.current.isSuccess);
    expect(resultQuery.current.data).toHaveLength(7);

    // When: mutationを実行する
    const { result: resultMutation, waitFor: waitForMutation } = renderHook(
      () => useMutationCompleteAllTodos(),
      { wrapper: wrapper }
    );

    act(() => {
      resultMutation.current.mutate();
    });
    await waitForMutation(() => resultMutation.current.isSuccess, {
      timeout: 1500,
    });

    // Then: TodoListの件数は最初と変わらず、全て完了になっていること
    const todos: Todo[] = resultQuery.current.data as Todo[];
    expect(todos).toHaveLength(7);
    for (let todo of todos) {
      expect(todo.isCompleted).toBeTruthy();
    }
  });

  test("完了済みのTodoをリストから削除する", async () => {
    // Given: Todoリストを作る
    const wrapper = queryClientWrapper();
    const { result: resultQuery, waitFor: waitForQuery } = renderHook(
      () => useQueryTodo(),
      { wrapper: wrapper }
    );
    await waitForQuery(() => resultQuery.current.isSuccess);
    expect(resultQuery.current.data).toHaveLength(7);

    // When: useMutationを実行する
    const { result: resultMutation, waitFor: waitForMutation } = renderHook(
      () => useMutationDeleteCompletedTodos(),
      {
        wrapper: wrapper,
      }
    );

    act(() => resultMutation.current.mutate());
    await waitForMutation(() => resultMutation.current.isSuccess, {
      timeout: 1500,
    });

    // Then: TodoListには未完了のTodoだけが残る
    const todos: Todo[] = resultQuery.current.data as Todo[];
    expect(todos).toHaveLength(4);
    for (let todo of todos) {
      expect(todo.isCompleted).toBeFalsy();
    }
  });
});