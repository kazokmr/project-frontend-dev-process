import { TodoColor, TodoColors } from "../model/filter/TodoColors";
import { capitalize } from "../model/filter/StringCapitalization";
import { Todo } from "../model/todo/Todo";
import {
  useMutationTodoChangedColor,
  useMutationTodoCompleted,
  useMutationTodoDeleted,
} from "../hooks/useTodos";

interface TodoItemProps {
  todo: Todo;
}

const TodoItem = ({ todo }: TodoItemProps): JSX.Element => {
  const mutateTodoCompleted = useMutationTodoCompleted();
  const mutateTodoChangedColor = useMutationTodoChangedColor();
  const mutateTodoDeleted = useMutationTodoDeleted();

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
          onChange={() => mutateTodoCompleted.mutate({ id: todo.id })}
        />
      </span>
      <span data-testid={"content-todo"}>{todo.text}</span>
      <span>
        <select
          aria-label={"select-todo-color"}
          value={todo.color}
          onChange={(event) =>
            mutateTodoChangedColor.mutate({
              id: todo.id,
              color: event.target.value as TodoColor,
            })
          }
        >
          {optionalColors}
        </select>
      </span>
      <span>
        <button
          aria-label={"delete-todo"}
          type={"button"}
          onClick={() => mutateTodoDeleted.mutate({ id: todo.id })}
        >
          X
        </button>
      </span>
    </li>
  );
};

export default TodoItem;
