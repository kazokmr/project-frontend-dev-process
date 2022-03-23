import { TodoColor, TodoColors } from "../model/filter/TodoColors";
import { capitalize } from "../model/filter/StringCapitalization";
import { Todo } from "../model/todo/Todo";

export interface TodoItemEventHandlers {
  onChangeComplete: (id: string) => void;
  onChangeColor: (id: string, changingColor: TodoColor) => void;
  onClickDelete: (id: string) => void;
}

interface TodoItemProps {
  todo: Todo;
  handlers: TodoItemEventHandlers;
}

const TodoItem = ({ todo, handlers }: TodoItemProps): JSX.Element => {
  const optionalColors: JSX.Element[] = TodoColors.map((color) => (
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
          onChange={() => handlers.onChangeComplete(todo.id)}
        />
      </span>
      <span aria-label={"content-todo"}>{todo.text}</span>
      <span>
        <select
          aria-label={"select-todo-color"}
          value={todo.color}
          onChange={(event) =>
            handlers.onChangeColor(todo.id, event.target.value as TodoColor)
          }
        >
          {optionalColors}
        </select>
      </span>
      <span>
        <button
          aria-label={"delete-todo"}
          type={"button"}
          onClick={() => handlers.onClickDelete(todo.id)}
        >
          X
        </button>
      </span>
    </li>
  );
};

export default TodoItem;
