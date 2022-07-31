import { Container } from "@mui/material";
import NewTodo from "./todoList/NewTodo";
import TodoList from "./todoList/TodoList";
import OperatingTodos from "./operating/OperatingTodos";
import { useQueryTodos } from "./hooks/useTodos";

const TodoApp = (): JSX.Element => {
  const { isLoading, isError, error } = useQueryTodos();

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error!!:{error.message}</span>;
  }

  return (
    <>
      <Container maxWidth="md" component="main">
        <NewTodo />
        <TodoList />
      </Container>
      <Container maxWidth="md" component="footer" sx={{ mt: 6 }}>
        <OperatingTodos />
      </Container>
    </>
  );
};

export default TodoApp;
