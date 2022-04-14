import TodoItem from "./TodoItem";
import { Todo } from "../model/todo/Todo";
import { useQueryClient } from "react-query";
import { TodoStatus } from "../model/filter/TodoStatus";
import { TodoColor } from "../model/filter/TodoColors";

const TodoList = (): JSX.Element => {
  const queryClient = useQueryClient();
  const status = queryClient.getQueryData<TodoStatus>(["status"]);
  const colors = queryClient.getQueryData<TodoColor[]>(["colors"]);
  const todos = queryClient.getQueryData<Todo[]>(["todos", { status, colors }]);

  return (
    <ul aria-label={"list-todo"}>
      {todos?.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

export default TodoList;
