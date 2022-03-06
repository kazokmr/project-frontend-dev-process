import { TodoColors } from "../model/filter/TodoColors";
import { capitalize } from "../model/filter/StringCapitalization";
import { Todo } from "../model/todo/Todo";

const TodoItem = ({
  todo,
  updateComplete,
}: {
  todo: Todo;
  updateComplete: (id: string) => void;
}) => {
  const optionalColors = TodoColors.map((color) => (
    <option key={color} value={color}>
      {capitalize(color)}
    </option>
  ));

  return (
    <li key={todo.id}>
      <span>
        <input
          type="checkbox"
          aria-label={"todo-isCompleted"}
          checked={todo.isCompleted}
          onChange={() => updateComplete(todo.id)}
        />
      </span>
      <span aria-label={"content-todo"}>{todo.text}</span>
      <span>
        <select
          aria-label={"select-todo-color"}
          value={todo.color}
          onChange={(event) => ""}
        >
          <option value="" />
          {optionalColors}
        </select>
      </span>
      <span>
        <button
          aria-label={"delete-todo"}
          type={"button"}
          onClick={(event) => ""}
        >
          X
        </button>
      </span>
    </li>
  );
};

export default TodoItem;
