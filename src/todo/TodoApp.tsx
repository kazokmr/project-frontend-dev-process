import { Container } from "@mui/material";
import { Suspense } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import NewTodo from "./todoList/NewTodo";
import TodoList from "./todoList/TodoList";
import OperatingTodos from "./operating/OperatingTodos";

const FallbackError = ({ error }: FallbackProps) => (
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  <p>Error!!:{error.message}</p>
);

const TodoApp = (): JSX.Element => (
  <ErrorBoundary FallbackComponent={FallbackError}>
    <Suspense fallback={<p>Loading...</p>}>
      <Container maxWidth="md" component="main">
        <NewTodo />
        <TodoList />
      </Container>
      <Container maxWidth="md" component="footer" sx={{ mt: 6 }}>
        <OperatingTodos />
      </Container>
    </Suspense>
  </ErrorBoundary>
);

export default TodoApp;
