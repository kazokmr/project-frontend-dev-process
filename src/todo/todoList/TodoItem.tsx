import { capitalize, Colors } from "../filter/Colors";

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
