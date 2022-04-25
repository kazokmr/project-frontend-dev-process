import TodoItem from "./TodoItem";
import { useFilteredTodos } from "../hooks/useTodos";

const TodoList = (): JSX.Element => {
  const todos = useFilteredTodos().data ?? [];

  return (
    <ul aria-label={"list-todo"}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

export default TodoList;
