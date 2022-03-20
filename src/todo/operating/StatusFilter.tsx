import { TODO_STATUS, TodoStatus } from "../model/filter/TodoStatus";
import { capitalize } from "../model/filter/StringCapitalization";

const StatusFilter = ({
  curStatus = TODO_STATUS.ALL,
  onClickStatus,
}: {
  curStatus?: TodoStatus;
  onClickStatus: (status: TodoStatus) => void;
}) => {
  return (
    <div>
      <h5>Filter by Status</h5>
      <ul>
        <li>
          <button
            type="button"
            aria-pressed={curStatus === TODO_STATUS.ALL}
            onClick={() => onClickStatus(TODO_STATUS.ALL)}
          >
            All
          </button>
        </li>
        <li>
          <button
            type="button"
            aria-pressed={curStatus === TODO_STATUS.ACTIVE}
            onClick={() => onClickStatus(TODO_STATUS.ACTIVE)}
          >
            {capitalize(TODO_STATUS.ACTIVE)}
          </button>
        </li>
        <li>
          <button
            type="button"
            aria-pressed={curStatus === TODO_STATUS.COMPLETED}
            onClick={() => onClickStatus(TODO_STATUS.COMPLETED)}
          >
            {capitalize(TODO_STATUS.COMPLETED)}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default StatusFilter;
