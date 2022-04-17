import { Todo } from "../model/todo/Todo";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TodoColor } from "../model/filter/TodoColors";
import { TODO_STATUS, TodoStatus } from "../model/filter/TodoStatus";

const fetchTodos = async (): Promise<Todo[]> => {
  const response = await axios.get("/todos");
  return response.data;
};

export function useQueryTodo() {
  return useQuery<Todo[], AxiosError, Todo[]>(["todos"], fetchTodos, {
    staleTime: Infinity,
  });
}

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
      onSettled: () => queryClient.invalidateQueries("todos"),
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
      onSettled: () => queryClient.invalidateQueries("todos"),
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
      onSettled: () => queryClient.invalidateQueries("todos"),
    }
  );
};

export const useMutationTodoDeleted = () => {
  const queryClient = useQueryClient();
  return useMutation(
    "todoDeleted",
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
      onSettled: () => queryClient.invalidateQueries("todos"),
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
    onSettled: () => queryClient.invalidateQueries("todos"),
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
    onSettled: () => queryClient.invalidateQueries("todos"),
  });
};
