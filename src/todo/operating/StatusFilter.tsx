import { TODO_STATUS, TodoStatus } from "../model/filter/TodoStatus";
import { capitalize } from "../model/filter/StringCapitalization";

const StatusFilter = ({ status }: { status: Array<TodoStatus> }) => {
  return (
    <div>
      <h5>Filter by Status</h5>
      <ul>
        <li>
          <button
            type="button"
            aria-pressed={status.length === 0 || status.length >= 2}
          >
            All
          </button>
        </li>
        <li>
          <button
            type="button"
            aria-pressed={
              status.length === 1 && status[0] === TODO_STATUS.ACTIVE
            }
          >
            {capitalize(TODO_STATUS.ACTIVE)}
          </button>
        </li>
        <li>
          <button
            type="button"
            aria-pressed={
              status.length === 1 && status[0] === TODO_STATUS.COMPLETED
            }
          >
            {capitalize(TODO_STATUS.COMPLETED)}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default StatusFilter;
