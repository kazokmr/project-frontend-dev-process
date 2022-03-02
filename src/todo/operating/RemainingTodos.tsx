const RemainingTodos = ({ numOfTodo }: { numOfTodo: number }) => {
  return (
    <div>
      <h5>Remaining Todos</h5>
      <div aria-label={"remaining-todos"}>
        {`${numOfTodo} remain${numOfTodo > 1 ? "s" : ""} left`}
      </div>
    </div>
  );
};

export default RemainingTodos;
