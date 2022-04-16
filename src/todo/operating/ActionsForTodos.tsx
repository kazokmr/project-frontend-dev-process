import {
  useMutationCompleteAllTodos,
  useMutationDeleteCompletedTodos,
} from "../hooks/useTodos";

const ActionsForTodos = (): JSX.Element => {
  const completeAllTodos = useMutationCompleteAllTodos();
  const deleteCompletedTodos = useMutationDeleteCompletedTodos();

  return (
    <div>
      <h5>Actions</h5>
      <ul>
        <li>
          <button type="button" onClick={() => completeAllTodos.mutate()}>
            Mark All Completed
          </button>
        </li>
        <li>
          <button type="button" onClick={() => deleteCompletedTodos.mutate()}>
            Clear Completed
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ActionsForTodos;
