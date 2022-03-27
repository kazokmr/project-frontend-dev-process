export interface ActionForTodosHandlers {
  onClickMarkAllCompleted: () => void;
  onClickClearCompleted: () => void;
}

const ActionsForTodos = ({
  onClickClearCompleted,
  onClickMarkAllCompleted,
}: ActionForTodosHandlers): JSX.Element => {
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
          <button type="button" onClick={() => onClickClearCompleted()}>
            Clear Completed
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ActionsForTodos;
