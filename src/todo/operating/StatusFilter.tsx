import { TODO_STATUS, TodoStatus } from "../model/filter/TodoStatus";
import { capitalize } from "../model/filter/StringCapitalization";
import { useQueryClient } from "react-query";

const StatusFilter = (): JSX.Element => {
  const queryClient = useQueryClient();
  const curStatus =
    queryClient.getQueryData<TodoStatus>(["status"]) ?? TODO_STATUS.ALL;
  const setStatus = (status: TodoStatus) => {
    queryClient.setQueryData<TodoStatus>(["status"], status);
  };

  return (
    <div>
      <h5>Filter by Status</h5>
      <ul>
        <li>
          <button
            type="button"
            aria-pressed={curStatus === TODO_STATUS.ALL}
            onClick={() => setStatus(TODO_STATUS.ALL)}
          >
            All
          </button>
        </li>
        <li>
          <button
            type="button"
            aria-pressed={curStatus === TODO_STATUS.ACTIVE}
            onClick={() => setStatus(TODO_STATUS.ACTIVE)}
          >
            {capitalize(TODO_STATUS.ACTIVE)}
          </button>
        </li>
        <li>
          <button
            type="button"
            aria-pressed={curStatus === TODO_STATUS.COMPLETED}
            onClick={() => setStatus(TODO_STATUS.COMPLETED)}
          >
            {capitalize(TODO_STATUS.COMPLETED)}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default StatusFilter;
