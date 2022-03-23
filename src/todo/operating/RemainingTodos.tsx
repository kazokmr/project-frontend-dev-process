const RemainingTodos = ({ numOfTodo }: { numOfTodo: number }): JSX.Element => {
  return (
    <div>
      <h5>Remaining Todos</h5>
      <div aria-label={"remaining-todos"}>
        {`${numOfTodo} item${numOfTodo > 1 ? "s" : ""} left`}
      </div>
    </div>
  );
};

export default RemainingTodos;
