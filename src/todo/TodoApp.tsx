import "./TodoApp.css";
import NewTodo from "./todoList/NewTodo";
import TodoList from "./todoList/TodoList";
import OperatingTodos from "./operating/OperatingTodos";
import { TodoColor } from "./model/filter/TodoColors";
import { TODO_STATUS, TodoStatus } from "./model/filter/TodoStatus";
import { useQueryTodo } from "./hooks/useTodos";
import { useQuery } from "react-query";

const TodoApp = (): JSX.Element => {
  const { data: status } = useQuery<TodoStatus>(["status"], {
    enabled: false,
    staleTime: Infinity,
    initialData: TODO_STATUS.ALL,
  });
  const { data: colors } = useQuery<TodoColor[]>(["colors"], {
    enabled: false,
    staleTime: Infinity,
    initialData: [] as TodoColor[],
  });
  const { isLoading, isError } = useQueryTodo({
    status,
    colors,
  });

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
