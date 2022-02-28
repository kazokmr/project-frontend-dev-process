import { TodoColor, TodoColors } from "../filter/TodoColors";
import { capitalize } from "../filter/StringCapitalization";
import { TODO_STATUS, TodoStatus } from "../filter/TodoStatus";

const TodoItem = ({
  todoStatus,
  todoColor,
}: {
  todoStatus: TodoStatus;
  todoColor?: TodoColor;
}) => {
  return (
    <li key={""} className="todo">
      <div>
        <input
          type="checkbox"
          checked={todoStatus === TODO_STATUS.COMPLETED}
          onChange={(event) => ""}
        />
      </div>
      <div>todo</div>
      <div>
        <select value={todoColor} onChange={(event) => ""}>
          <option value="" />
          {TodoColors.map((color) => (
            <option key={color} value={color}>
              {capitalize(color)}
            </option>
          ))}
        </select>
      </div>
      <div>X</div>
    </li>
  );
};

export default TodoItem;
