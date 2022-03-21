const ActionsForTodos = ({
  onClickMarkAllCompleted,
}: {
  onClickMarkAllCompleted: () => void;
}) => {
  return (
    <div>
      <h5>Actions</h5>
      <ul>
        <li>
          <button type="button" onClick={() => onClickMarkAllCompleted()}>
            Mark All Completed
          </button>
        </li>
        <li>
          <button type="button">Clear Completed</button>
        </li>
      </ul>
    </div>
  );
};

export default ActionsForTodos;
