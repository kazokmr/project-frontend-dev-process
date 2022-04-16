import { useQueryClient } from "react-query";
import { Todo } from "../model/todo/Todo";

const RemainingTodos = (): JSX.Element => {
  const queryClient = useQueryClient();
  const todos = queryClient.getQueryData<Todo[]>(["todos"]) ?? [];
  const numOfTodo = todos.filter((todo: Todo) => !todo.isCompleted).length;
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
