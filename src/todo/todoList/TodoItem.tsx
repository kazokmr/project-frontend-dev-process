import { TodoColor, TodoColors } from "../filter/TodoColors";
import { capitalize } from "../filter/StringCapitalization";
import { TODO_STATUS, TodoStatus } from "../filter/TodoStatus";

const TodoItem = ({
  todoText,
  todoStatus,
  todoColor,
}: {
  todoText: string;
  todoStatus: TodoStatus;
  todoColor?: TodoColor;
}) => {
  return (
    <li key={""}>
      <span>
        <input
          type="checkbox"
          checked={todoStatus === TODO_STATUS.COMPLETED}
          onChange={(event) => ""}
        />
      </span>
      <span data-testid={"todo-text"}>{todoText}</span>
      <span>
        <select value={todoColor} onChange={(event) => ""}>
          <option value="" />
          {TodoColors.map((color) => (
            <option key={color} value={color}>
              {capitalize(color)}
            </option>
          ))}
        </select>
      </span>
      <span>
        <button type={"button"} onClick={(event) => ""}>
          X
        </button>
      </span>
    </li>
  );
};

export default TodoItem;
