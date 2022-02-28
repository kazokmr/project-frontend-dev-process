import { Color, Colors } from "../filter/Colors";
import { capitalize } from "../filter/StringCapitalization";
import { TODO_STATUS, Todo_Status } from "../filter/TodoStatus";

const TodoItem = ({
  todoStatus,
  todoColor,
}: {
  todoStatus: Todo_Status;
  todoColor?: Color;
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
          {Colors.map((color) => (
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
