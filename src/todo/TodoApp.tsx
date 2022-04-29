import NewTodo from "./todoList/NewTodo";
import TodoList from "./todoList/TodoList";
import OperatingTodos from "./operating/OperatingTodos";
import { useQueryTodo } from "./hooks/useTodos";
import { atom } from "recoil";
import { TODO_STATUS, TodoStatus } from "./model/filter/TodoStatus";
import { TodoColor } from "./model/filter/TodoColors";
import { Container } from "@mui/material";

export const statusFilterState = atom<TodoStatus>({
  key: "status",
  default: TODO_STATUS.ALL,
});
export const colorsFilterState = atom<TodoColor[]>({
  key: "colors",
  default: [],
});

const TodoApp = (): JSX.Element => {
  const { isLoading, isError, error } = useQueryTodo();

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error!!:{error?.message}</span>;
  }

  return (
    <>
      <Container component={"main"}>
        <NewTodo />
        <TodoList />
      </Container>
      <Container component={"footer"} sx={{ mt: "8" }}>
        <OperatingTodos />
      </Container>
    </>
  );
};

export default TodoApp;
