import { Todo } from "../model/todo/Todo";
import { useQueryTodo } from "../hooks/useTodos";

const RemainingTodos = (): JSX.Element => {
  const { data: todos } = useQueryTodo();
  const numOfTodo = todos
    ? todos.filter((todo: Todo) => !todo.isCompleted).length
    : 0;
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
