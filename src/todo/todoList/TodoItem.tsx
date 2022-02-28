import { TodoColors } from "../model/filter/TodoColors";
import { TODO_STATUS } from "../model/filter/TodoStatus";
import { capitalize } from "../model/filter/StringCapitalization";
import { Todo } from "../model/todo/Todo";

const TodoItem = (todo: Todo) => {
  const optionalColors = TodoColors.map((color) => (
    <option key={color} value={color}>
      {capitalize(color)}
    </option>
  ));

  return (
    <li key={""}>
      <span>
        <input
          type="checkbox"
          checked={todo.status === TODO_STATUS.COMPLETED}
          onChange={(event) => ""}
        />
      </span>
      <span data-testid={"todo-text"}>{todo.text}</span>
      <span>
        <select value={todo.color} onChange={(event) => ""}>
          <option value="" />
          {optionalColors}
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
