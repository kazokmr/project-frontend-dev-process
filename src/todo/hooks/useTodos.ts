import { Todo } from "../model/todo/Todo";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TODO_STATUS, TodoStatus } from "../model/filter/TodoStatus";
import { TodoColor } from "../model/filter/TodoColors";

const fetchTodos = async ({
  status,
  colors,
}: {
  status: TodoStatus;
  colors: TodoColor[];
}): Promise<Todo[]> => {
  const response = await axios.get("/todos");
  const todos: Todo[] = response.data;
  return todos
    .filter(
      (todo) =>
        status === TODO_STATUS.ALL ||
        (status === TODO_STATUS.ACTIVE && !todo.isCompleted) ||
        (status === TODO_STATUS.COMPLETED && todo.isCompleted)
    )
    .filter((todo) => colors.length === 0 || colors.includes(todo.color));
};

export function useTodos({
  status = TODO_STATUS.ALL,
  colors = [],
}: {
  status?: TodoStatus;
  colors?: TodoColor[];
}) {
  return useQuery<Todo[]>(["todos", { status, colors }], () =>
    fetchTodos({ status, colors })
  );
}

export const useMutationAddTodo = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ text }: { text: string }) => axios.post("/todo", { text: text }),
    {
      onSuccess: () => queryClient.invalidateQueries("todos"),
    }
  );
};

export const useMutationChangeTodoCompleted = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id }: { id: string }) => axios.put(`/todo/${id}/complete`),
    {
      onSuccess: () => queryClient.invalidateQueries("todos"),
    }
  );
};

export const useMutationChangeTodoColor = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, color }: { id: string; color: TodoColor }) =>
      axios.put(`/todo/${id}/changeColor`, { color: color }),
    {
      onSuccess: () => queryClient.invalidateQueries("todos"),
    }
  );
};

export const useMutationDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id }: { id: string }) => axios.delete(`/todo/${id}`), {
    onSuccess: () => queryClient.invalidateQueries("todos"),
  });
};
