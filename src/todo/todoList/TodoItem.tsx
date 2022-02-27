import { Colors } from "../filter/Colors";
import { capitalize } from "../filter/StringCapitalization";

const TodoItem = () => {
  return (
    <li key={""} className="todo">
      <div>
        <input type="checkbox" checked={false} onChange={(event) => ""} />
      </div>
      <div>todo</div>
      <div>
        <select value={""} onChange={(event) => ""}>
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
