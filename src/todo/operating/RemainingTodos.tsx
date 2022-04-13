import { useQueryClient } from "react-query";
import { TodoStatus } from "../model/filter/TodoStatus";
import { TodoColor } from "../model/filter/TodoColors";
import { Todo } from "../model/todo/Todo";

const RemainingTodos = (): JSX.Element => {
  const queryClient = useQueryClient();
  const status = queryClient.getQueryData<TodoStatus>(["status"]);
  const colors = queryClient.getQueryData<TodoColor[]>(["colors"]);
  const todos = queryClient.getQueryData<Todo[]>(["todos", { status, colors }]);
  const numOfTodo = todos ? todos.length : 0;
  return (
    <div>
      <h5>Remaining Todos</h5>
      <div data-testid={"remaining-todos"}>
        {`${numOfTodo} item${numOfTodo > 1 ? "s" : ""} left`}
      </div>
    </div>
  );
};

export default RemainingTodos;
