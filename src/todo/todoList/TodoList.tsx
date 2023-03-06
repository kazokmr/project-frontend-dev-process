import { List } from "@mui/material";
import TodoItem from "./TodoItem";
import { useFilteredTodos } from "../hooks/useTodos";
import { Todo } from "../model/todo/Todo";

const TodoList = (): JSX.Element => {
  const todos = useFilteredTodos().data ?? [];

  return (
    <List aria-label="list-todo" dense>
      {todos.map((todo: Todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </List>
  );
};

export default TodoList;
