import { ReactNode } from "react";
import { QueryClient, QueryClientProvider, UseSuspenseQueryResult } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import {
  useFilteredTodos,
  useMutationCompleteAllTodos,
  useMutationDeleteCompletedTodos,
  useMutationTodoAdded,
  useMutationTodoChangedColor,
  useMutationTodoCompleted,
  useMutationTodoDeleted,
} from "./useTodos";
import { Todo } from "../model/todo/Todo";
import { TODO_COLOR } from "../model/filter/TodoColors";
import { setMockedTodo } from "../../mocks/handlers";

// Testデータ
const testTodos: Todo[] = [
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

// QueryClientオブジェクトをテスト用の設定にして生成
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: Infinity,
      staleTime: Infinity,
    },
  },
});

// テスト対象のカスタムHookでQueryClientを利用するためのカスタムWrapper
const wrapper = ({ children }: { children: ReactNode }) => (
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </RecoilRoot>
);

beforeEach(() => {
  // テストごとにQueryClientのキャッシュをクリアする
  queryClient.clear();
  // Todoデータをリセットする
  setMockedTodo(testTodos);
});

describe("React QueryによるServerState管理", () => {
  describe("useTodoQueryのテスト", () => {
    test("バックエンドAPIを使いTodoリストが取得できること", async () => {
      // When: 全てのTodoを検索する
      const { result } = renderHook<UseSuspenseQueryResult, unknown>(() => useFilteredTodos(), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

      // Then: todoが取得できること
      expect(result.current.data).toHaveLength(7);
      expect(result.current.data).toStrictEqual(testTodos);
    });
  });

  describe("useMutationTodoのテスト", () => {
    test("Todoを追加するとTodoリストを再フェッチする", async () => {
      // Given: 検証用のuseQueryTodoカスタムフックを出力する
      const { result: resultQuery } = renderHook<UseSuspenseQueryResult, unknown>(() => useFilteredTodos(), {
        wrapper,
      });
      await waitFor(() => expect(resultQuery.current.isSuccess).toBeTruthy());
      expect(resultQuery.current.data).toHaveLength(7);

      // When: mutateを実行して新しいTodoを実行する
      const { result: resultMutation } = renderHook(() => useMutationTodoAdded(), { wrapper });
      const text = "new todo";
      resultMutation.current.mutate({ text });
      await waitFor(() => expect(resultMutation.current.isSuccess).toBeTruthy());

      // Then: resultQueryが再FetchされTodoが追加される
      const todosAfterAdded: Todo[] = resultQuery.current.data as Todo[];
      expect(todosAfterAdded).toHaveLength(8);
      expect(todosAfterAdded[7].text).toBe(text);
      expect(todosAfterAdded[7].isCompleted).toBeFalsy();
      expect(todosAfterAdded[7].color).toBe(TODO_COLOR.None);

      // 登録したtextが、TodoオブジェクトでresultMutationに返される
      const after: Todo = resultMutation.current.data ?? new Todo("failed");
      expect(after.text).toBe(text);
      expect(after.isCompleted).toBeFalsy();
      expect(after.color).toBe(TODO_COLOR.None);
    });

    test("指定したIDのTodoをCompletedにする", async () => {
      // Given: 検証用のuseQueryTodoカスタムフックを出力する
      const { result: resultQuery } = renderHook<UseSuspenseQueryResult, unknown>(() => useFilteredTodos(), {
        wrapper,
      });
      // 最初は未完了であることを確認する
      await waitFor(() => expect(resultQuery.current.isSuccess).toBeTruthy());
      const before: Todo[] = resultQuery.current.data as Todo[];
      expect(before[2].isCompleted).toBeFalsy();

      // When: mutateを実行して指定IDのTodoのCompleted状況を変更する
      const { result: resultMutation } = renderHook(() => useMutationTodoCompleted(), { wrapper });
      resultMutation.current.mutate({ id: "3" });
      await waitFor(() => expect(resultMutation.current.isSuccess).toBeTruthy());

      // Then: queryデータが再FetchされTodoの完了状況が更新される
      const after: Todo[] = resultQuery.current.data as Todo[];
      expect(after[2].text).toBe(before[2].text);
      expect(after[2].isCompleted).not.toBe(before[2].isCompleted);
      expect(after[2].color).toBe(before[2].color);
    });
  });

  test("指定したIDのTodoのColorを変更する", async () => {
    // Given: 検証用のuseQueryTodoカスタムフックを出力する
    const { result: resultQuery } = renderHook<UseSuspenseQueryResult, unknown>(() => useFilteredTodos(), { wrapper });
    // 最初はRedであることを確認する
    await waitFor(() => expect(resultQuery.current.isSuccess).toBeTruthy());
    const before: Todo[] = resultQuery.current.data as Todo[];
    expect(before[1].color).toBe(TODO_COLOR.Red);

    // When: mutateを実行してColorを変更する
    const { result: resultMutation } = renderHook(() => useMutationTodoChangedColor(), { wrapper });
    resultMutation.current.mutate({ id: "2", color: TODO_COLOR.Purple });
    await waitFor(() => expect(resultMutation.current.isSuccess).toBeTruthy());

    // Then: queryデータが再FetchされTodoの完了状況が更新される
    const after: Todo[] = resultQuery.current.data as Todo[];
    expect(after[1].text).toBe(before[1].text);
    expect(after[1].isCompleted).toBe(before[1].isCompleted);
    expect(after[1].color).toBe(TODO_COLOR.Purple);
  });

  test("指定したIDのTodoをリストから削除する", async () => {
    // Given: 検証用のuseQueryTodoカスタムフックを出力する
    const { result: resultQuery } = renderHook<UseSuspenseQueryResult, unknown>(() => useFilteredTodos(), { wrapper });
    // 最初は７件取得できる
    await waitFor(() => expect(resultQuery.current.isSuccess).toBeTruthy());
    expect(resultQuery.current.data).toHaveLength(7);

    // When:mutateを実行して指定したIDを削除する
    const { result: resultMutation } = renderHook(() => useMutationTodoDeleted(), { wrapper });
    resultMutation.current.mutate({ id: "4" });
    await waitFor(() => expect(resultMutation.current.isSuccess).toBeTruthy());

    // Then: queryデータが再FetchされTodoが６件になっていること
    const after: Todo[] = resultQuery.current.data as Todo[];
    expect(after).toHaveLength(6);
    expect(after[2].id).toBe("3");
    expect(after[3].id).toBe("5");
  });

  test("全てのTodoを完了済みにする", async () => {
    // Given: 検証用のuseQueryTodoカスタムフックを出力する
    const { result: resultQuery } = renderHook<UseSuspenseQueryResult, unknown>(() => useFilteredTodos(), { wrapper });
    // 最初は７件取得できる
    await waitFor(() => expect(resultQuery.current.isSuccess).toBeTruthy());
    expect(resultQuery.current.data).toHaveLength(7);

    // When:mutateを実行して全てのTodoリストを完了済みにする
    const { result: resultMutation } = renderHook(() => useMutationCompleteAllTodos(), { wrapper });
    resultMutation.current.mutate();
    await waitFor(() => expect(resultMutation.current.isSuccess).toBeTruthy());

    // Then: TodoListの件数は最初と変わらず、全て完了になっていること
    const after: Todo[] = resultQuery.current.data as Todo[];
    expect(after).toHaveLength(7);
    after.forEach((todo: Todo) => expect(todo.isCompleted).toBeTruthy());
  });

  test("完了済みのTodoをリストから削除する", async () => {
    // Given: 検証用のuseQueryTodoカスタムフックを出力する
    const { result: resultQuery } = renderHook<UseSuspenseQueryResult, unknown>(() => useFilteredTodos(), { wrapper });
    // 最初は７件取得できる
    await waitFor(() => expect(resultQuery.current.isSuccess).toBeTruthy());
    expect(resultQuery.current.data).toHaveLength(7);

    // When: useMutationを実行して完了済みのTodoを削除する
    const { result: resultMutation } = renderHook(() => useMutationDeleteCompletedTodos(), { wrapper });
    resultMutation.current.mutate();
    await waitFor(() => expect(resultMutation.current.isSuccess).toBeTruthy());

    // Then: TodoListには未完了のTodoだけが残る
    const after: Todo[] = resultQuery.current.data as Todo[];
    expect(after).toHaveLength(4);
    after.forEach((todo: Todo) => expect(todo.isCompleted).toBeFalsy());
  });
});
