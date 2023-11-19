import { ReactElement, Suspense } from "react";
import { Container } from "@mui/material";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import NewTodo from "./todoList/NewTodo";
import TodoList from "./todoList/TodoList";
import OperatingTodos from "./operating/OperatingTodos";
import "./TodoApp.module.css";

const FallbackError = ({ error }: FallbackProps) => (
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  <p>Error!!:{error.message}</p>
);

const TodoApp = (): ReactElement => (
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
