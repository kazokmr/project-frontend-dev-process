import { TODO_STATUS } from "../model/filter/TodoStatus";
import TodoItem from "./TodoItem";
import { Todo } from "../model/todo/Todo";
import {
  useQueryColors,
  useQueryStatus,
  useQueryTodo,
} from "../hooks/useTodos";

const TodoList = (): JSX.Element => {
  const colors = useQueryColors();
  const status = useQueryStatus();
  const data = useQueryTodo().data ?? [];

  const todos = data
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
