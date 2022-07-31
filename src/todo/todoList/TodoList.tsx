import { List } from "@mui/material";
import TodoItem from "./TodoItem";
import { useFilteredTodos } from "../hooks/useTodos";

const TodoList = (): JSX.Element => {
  const todos = useFilteredTodos().data ?? [];

  return (
    <List aria-label="list-todo" dense>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </List>
  );
};

export default TodoList;
