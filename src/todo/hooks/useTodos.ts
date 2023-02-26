import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { atom, useRecoilValue } from "recoil";
import { Todo } from "../model/todo/Todo";
import { TodoColor } from "../model/filter/TodoColors";
import { TODO_STATUS, TodoStatus } from "../model/filter/TodoStatus";
import { RestClient } from "../client/impl/RestClient";
import { HttpClient } from "../client/HttpClient";

export const statusFilterState = atom<TodoStatus>({
  key: "status",
  default: TODO_STATUS.ALL,
});
export const colorsFilterState = atom<TodoColor[]>({
  key: "colors",
  default: [],
});

const client: HttpClient = new RestClient();

const fetchTodos = () => client.queryTodos();

export function useQueryTodos<T>(select?: (data: Todo[]) => T) {
  return useQuery<Todo[], Error, T>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    staleTime: Infinity,
    select,
  });
}

export const useFilteredTodos = () => {
  const status = useRecoilValue(statusFilterState);
  const colors = useRecoilValue(colorsFilterState);
  return useQueryTodos<Todo[]>((todos: Todo[]) =>
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
};

export const useRemainingTodos = () =>
  useQueryTodos<number>(
    (todos: Todo[]) => todos.filter((todo: Todo) => !todo.isCompleted).length
  );

export const useMutationTodoAdded = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ text }: { text: string }) => client.addTodo(text),
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
  });
};

export const useMutationTodoCompleted = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => client.completeTodo(id),
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
  });
};

export const useMutationTodoChangedColor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, color }: { id: string; color: TodoColor }) =>
      client.changeColor(id, color),
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
  });
};

export const useMutationTodoDeleted = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["todoDeleted"],
    mutationFn: ({ id }: { id: string }) => client.deleteTodo(id),
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
    onError: (error, variables, context) => {
      queryClient.setQueryData(["todos"], context?.oldTodos);
    },
    onSettled: () => queryClient.invalidateQueries(["todos"]),
  });
};

export const useMutationCompleteAllTodos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => client.completeAllTodos(),
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
  return useMutation({
    mutationFn: () => client.deleteCompletedTodos(),
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
