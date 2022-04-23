import { Todo } from "../model/todo/Todo";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TodoColor } from "../model/filter/TodoColors";
import { TODO_STATUS, TodoStatus } from "../model/filter/TodoStatus";

const fetchTodos = async () => {
  try {
    const response = await axios.get("/todos");
    return response.data;
  } catch (err) {
    // Axiosから返るエラーの場合
    if (axios.isAxiosError(err)) {
      // レスポンスが返ってきた場合
      if (err.response) {
        throw new Error(
          `HTTPステータス: ${err.response.status}: ${err.response.data.errorMessage}`
        );
      } else {
        throw new Error(`サーバーエラー: ${err.message}`);
      }
    } else {
      // Axios以外の想定外エラー
      throw new Error(`予期せぬエラー: ${(err as Error).message}`);
    }
  }
};

export function useQueryTodo<T>(select?: (data: Todo[]) => T) {
  return useQuery<Todo[], Error, T>(["todos"], fetchTodos, {
    staleTime: Infinity,
    select,
    notifyOnChangeProps: ["data"],
  });
}

export const useFilteredTodos = ({
  status,
  colors,
}: {
  status: TodoStatus;
  colors: TodoColor[];
}) =>
  useQueryTodo<Todo[]>((todos: Todo[]) =>
    todos
      .filter(
        (todo: Todo) =>
          status === TODO_STATUS.ALL ||
          (status === TODO_STATUS.COMPLETED && todo.isCompleted) ||
          (status === TODO_STATUS.ACTIVE && !todo.isCompleted)
      )
      .filter(
        (todo: Todo) => colors.length === 0 || colors.includes(todo.color)
      )
  );

export const useRemainingTodos = () =>
  useQueryTodo<number>((todos: Todo[]) =>
    todos ? todos.filter((todo: Todo) => !todo.isCompleted).length : 0
  );

export const useQueryStatus = () =>
  useQuery<TodoStatus, Error>(["status"], {
    enabled: false,
    staleTime: Infinity,
    initialData: TODO_STATUS.ALL,
  }).data ?? TODO_STATUS.ALL;

export const useQueryColors = () =>
  useQuery<TodoColor[], Error>(["colors"], {
    enabled: false,
    staleTime: Infinity,
    initialData: [],
  }).data ?? [];

export const useMutationTodoAdded = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ text }: { text: string }) => axios.post("/todo", { text: text }),
    {
      onMutate: async ({ text }: { text: string }) => {
        await queryClient.cancelQueries(["todos"]);
        const oldTodos = queryClient.getQueryData<Todo[]>(["todos"]) ?? [];
        const updater = [...oldTodos, new Todo(text)];
        queryClient.setQueryData(["todos"], updater);
        return { oldTodos };
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData(["todos"], context?.oldTodos);
      },
      onSettled: () => queryClient.invalidateQueries(["todos"]),
    }
  );
};

export const useMutationTodoCompleted = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id }: { id: string }) => axios.put(`/todo/${id}/complete`),
    {
      onMutate: async ({ id }: { id: string }) => {
        await queryClient.cancelQueries(["todos"]);
        const oldTodos = queryClient.getQueryData<Todo[]>(["todos"]) ?? [];
        const updater = oldTodos.map((todo: Todo) =>
          todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
        );
        queryClient.setQueryData(["todos"], updater);
        return { oldTodos };
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData(["todos"], context?.oldTodos);
      },
      onSettled: () => queryClient.invalidateQueries(["todos"]),
    }
  );
};

export const useMutationTodoChangedColor = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, color }: { id: string; color: TodoColor }) =>
      axios.put(`/todo/${id}/changeColor`, { color: color }),
    {
      onMutate: async ({ id, color }: { id: string; color: TodoColor }) => {
        await queryClient.cancelQueries(["todos"]);
        const oldTodos = queryClient.getQueryData<Todo[]>(["todos"]) ?? [];
        const updater = oldTodos.map((todo: Todo) =>
          todo.id === id ? { ...todo, color } : todo
        );
        queryClient.setQueryData(["todos"], updater);
        return { oldTodos };
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData(["todos"], context?.oldTodos);
      },
      onSettled: () => queryClient.invalidateQueries(["todos"]),
    }
  );
};

export const useMutationTodoDeleted = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ["todoDeleted"],
    ({ id }: { id: string }) => axios.delete(`/todo/${id}`),
    {
      // Mutateが呼ばれたタイミングでClient Cacheを更新する
      onMutate: async ({ id }: { id: string }) => {
        // invalidateQueriesからのreFetchで上書きされないようにキャンセルする
        await queryClient.cancelQueries(["todos"]);
        // 更新前データのスナップショットをバックアップする
        const oldTodos = queryClient.getQueryData<Todo[]>(["todos"]) ?? [];
        // 期待する結果にClient Cacheを更新する(楽観的アップデート)
        const updater = oldTodos.filter((todo: Todo) => todo.id !== id);
        queryClient.setQueriesData(["todos"], updater);
        // Contextにスナップショットをセットする
        return { oldTodos };
      },
      // Errorの場合はContextに退避したスナップショットにCacheを戻す
      onError: (error, variables, context) => {
        queryClient.setQueryData(["todos"], context?.oldTodos);
      },
      // onSettledで、Success時もError時も最後にreFetchしてサーバーの最新情報に更新する
      onSettled: () => queryClient.invalidateQueries(["todos"]),
    }
  );
};

export const useMutationCompleteAllTodos = () => {
  const queryClient = useQueryClient();
  return useMutation(() => axios.put("/todo/completeAll"), {
    onMutate: async () => {
      await queryClient.cancelQueries(["todos"]);
      const oldTodos = queryClient.getQueryData<Todo[]>(["todos"]) ?? [];
      const updater = oldTodos.map((todo: Todo) => ({
        ...todo,
        isCompleted: true,
      }));
      queryClient.setQueryData(["todos"], updater);
      return { oldTodos };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["todos"], context?.oldTodos);
    },
    onSettled: () => queryClient.invalidateQueries(["todos"]),
  });
};

export const useMutationDeleteCompletedTodos = () => {
  const queryClient = useQueryClient();
  return useMutation(() => axios.put("/todo/deleteCompleted"), {
    onMutate: async () => {
      await queryClient.cancelQueries(["todos"]);
      const oldTodos = queryClient.getQueryData<Todo[]>(["todos"]) ?? [];
      const updater = oldTodos.filter((todo: Todo) => !todo.isCompleted);
      queryClient.setQueryData(["todos"], updater);
      return { oldTodos };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["todos"], context?.oldTodos);
    },
    onSettled: () => queryClient.invalidateQueries(["todos"]),
  });
};
