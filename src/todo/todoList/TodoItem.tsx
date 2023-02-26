import {
  capitalize,
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  NativeSelect,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ChangeEvent } from "react";
import { TodoColor, TodoColors } from "../model/filter/TodoColors";
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

  const optionalColors: JSX.Element[] = TodoColors.map((color: TodoColor) => (
    <option key={color} value={color}>
      {capitalize(color)}
    </option>
  ));

  return (
    <ListItem
      key={todo.id}
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete-todo"
          onClick={() => mutateTodoDeleted.mutate({ id: todo.id })}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemIcon>
        <Checkbox
          edge="start"
          inputProps={{ "aria-label": "todo-isCompleted" }}
          checked={todo.isCompleted}
          onChange={() => mutateTodoCompleted.mutate({ id: todo.id })}
        />
      </ListItemIcon>
      <ListItemText primary={todo.text} data-testid="content-todo" />
      <NativeSelect
        variant="standard"
        inputProps={{ "aria-label": "select-todo-color" }}
        value={todo.color}
        onChange={(event: ChangeEvent<HTMLSelectElement>) =>
          mutateTodoChangedColor.mutate({
            id: todo.id,
            color: event.target.value as TodoColor,
          })
        }
        sx={{ color: todo.color, width: 100 }}
      >
        {optionalColors}
      </NativeSelect>
    </ListItem>
  );
};

export default TodoItem;
