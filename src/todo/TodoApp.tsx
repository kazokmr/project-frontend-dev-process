import { Container } from "@mui/material";
import { Suspense } from "react";
import NewTodo from "./todoList/NewTodo";
import TodoList from "./todoList/TodoList";
import OperatingTodos from "./operating/OperatingTodos";

const TodoApp = (): JSX.Element => (
  <Suspense fallback={<p>Loading...</p>}>
    <Container maxWidth="md" component="main">
      <NewTodo />
      <TodoList />
    </Container>
    <Container maxWidth="md" component="footer" sx={{ mt: 6 }}>
      <OperatingTodos />
    </Container>
  </Suspense>
);

export default TodoApp;
