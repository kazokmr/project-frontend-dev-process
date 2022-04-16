import TodoItem from "./TodoItem";
import { Todo } from "../model/todo/Todo";
import { useQueryClient } from "react-query";
import { TODO_STATUS, TodoStatus } from "../model/filter/TodoStatus";
import { TodoColor } from "../model/filter/TodoColors";

const TodoList = (): JSX.Element => {
  const queryClient = useQueryClient();
  const status =
    queryClient.getQueryData<TodoStatus>(["status"]) ?? TODO_STATUS.ALL;
  const colors = queryClient.getQueryData<TodoColor[]>(["colors"]) ?? [];
  const data = queryClient.getQueryData<Todo[]>(["todos"]) ?? [];
  const todos: Todo[] = data
    .filter(
      (todo: Todo) =>
        status === TODO_STATUS.ALL ||
        (status === TODO_STATUS.COMPLETED && todo.isCompleted) ||
        (status === TODO_STATUS.ACTIVE && !todo.isCompleted)
    )
    .filter(
      (todo: Todo) => colors?.length === 0 || colors?.includes(todo.color)
    );

  return (
    <ul aria-label={"list-todo"}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

export default TodoList;
