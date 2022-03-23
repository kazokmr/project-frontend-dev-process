export interface ActionForTodosHandlers {
  onClickMarkAllCompleted: () => void;
  onClickClearCompleted: () => void;
}

interface ActionForTodosProps {
  handlers: ActionForTodosHandlers;
}

const ActionsForTodos = ({ handlers }: ActionForTodosProps): JSX.Element => {
  return (
    <div>
      <h5>Actions</h5>
      <ul>
        <li>
          <button
            type="button"
            onClick={() => handlers.onClickMarkAllCompleted()}
          >
            Mark All Completed
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => handlers.onClickClearCompleted()}
          >
            Clear Completed
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ActionsForTodos;
