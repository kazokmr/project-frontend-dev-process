import { ReactElement } from "react";
import { List } from "@mui/material";
import TodoItem from "./TodoItem";
import { useFilteredTodos } from "../hooks/useTodos";
import { Todo } from "../model/todo/Todo";

const TodoList = (): ReactElement => {
  const { data } = useFilteredTodos();

  return (
    <List aria-label="list-todo" dense>
      {data?.map((todo: Todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </List>
  );
};

export default TodoList;
