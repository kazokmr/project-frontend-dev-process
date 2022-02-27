const RemainingTodos = ({ numOfTodo }: { numOfTodo: number }) => {
  return (
    <div>
      <h5>Remaining Todos</h5>
      <div>{`${numOfTodo} remain${numOfTodo > 1 ? "s" : ""} left`}</div>
    </div>
  );
};

export default RemainingTodos;
