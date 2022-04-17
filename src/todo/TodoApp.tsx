import "./TodoApp.css";
import NewTodo from "./todoList/NewTodo";
import TodoList from "./todoList/TodoList";
import OperatingTodos from "./operating/OperatingTodos";
import { useQueryTodo } from "./hooks/useTodos";

const TodoApp = (): JSX.Element => {
  const { isLoading, isError } = useQueryTodo();

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error!!</span>;
  }

  return (
    <div className="todo-container">
      <NewTodo />
      <TodoList />
      <OperatingTodos />
    </div>
  );
};

export default TodoApp;
