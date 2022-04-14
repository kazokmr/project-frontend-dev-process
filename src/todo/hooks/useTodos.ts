import { Todo } from "../model/todo/Todo";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TODO_STATUS, TodoStatus } from "../model/filter/TodoStatus";
import { TodoColor } from "../model/filter/TodoColors";

interface TodosQueryParams {
  status: TodoStatus;
  colors: TodoColor[];
}

const fetchTodos = async ({
  status,
  colors,
}: TodosQueryParams): Promise<Todo[]> => {
  const response = await axios.get("/todos");
  const todos: Todo[] = response.data;
  return todos
    .filter(
      (todo: Todo) =>
        status === TODO_STATUS.ALL ||
        (status === TODO_STATUS.ACTIVE && !todo.isCompleted) ||
        (status === TODO_STATUS.COMPLETED && todo.isCompleted)
    )
    .filter((todo: Todo) => colors.length === 0 || colors.includes(todo.color));
};

export function useQueryTodo({
  status = TODO_STATUS.ALL,
  colors = [],
}: Partial<TodosQueryParams>) {
  return useQuery<Todo[]>(
    ["todos", { status, colors }],
    () => fetchTodos({ status, colors }),
    { staleTime: Infinity }
  );
}

export const useMutationTodoAdded = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ text }: { text: string }) => axios.post("/todo", { text: text }),
    {
      onSuccess: () => queryClient.invalidateQueries("todos"),
    }
  );
};

export const useMutationTodoCompleted = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id }: { id: string }) => axios.put(`/todo/${id}/complete`),
    {
      onSuccess: () => queryClient.invalidateQueries("todos"),
    }
  );
};

export const useMutationTodoChangedColor = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, color }: { id: string; color: TodoColor }) =>
      axios.put(`/todo/${id}/changeColor`, { color: color }),
    {
      onSuccess: () => queryClient.invalidateQueries("todos"),
    }
  );
};

export const useMutationTodoDeleted = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id }: { id: string }) => axios.delete(`/todo/${id}`), {
    onSuccess: () => queryClient.invalidateQueries("todos"),
  });
};

export const useMutationCompleteAllTodos = () => {
  const queryClient = useQueryClient();
  return useMutation(() => axios.put("/todo/completeAll"), {
    onSuccess: () => queryClient.invalidateQueries("todos"),
  });
};

export const useMutationDeleteCompletedTodos = () => {
  const queryClient = useQueryClient();
  return useMutation(() => axios.put("/todo/deleteCompleted"), {
    onSuccess: () => queryClient.invalidateQueries("todos"),
  });
};
