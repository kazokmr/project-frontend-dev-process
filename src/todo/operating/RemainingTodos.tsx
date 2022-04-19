import { useRemainingTodos } from "../hooks/useTodos";

const RemainingTodos = (): JSX.Element => {
  const numOfTodo = useRemainingTodos().data ?? 0;

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
