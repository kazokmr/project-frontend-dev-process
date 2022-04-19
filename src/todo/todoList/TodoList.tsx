import TodoItem from "./TodoItem";
import {
  useFilteredTodos,
  useQueryColors,
  useQueryStatus,
} from "../hooks/useTodos";

const TodoList = (): JSX.Element => {
  const status = useQueryStatus();
  const colors = useQueryColors();
  const todos = useFilteredTodos({ status, colors }).data ?? [];

  return (
    <ul aria-label={"list-todo"}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

export default TodoList;
