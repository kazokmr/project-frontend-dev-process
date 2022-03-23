import TodoItem, { TodoItemEventHandlers } from "./TodoItem";
import { Todo } from "../model/todo/Todo";

type TodoListProp = {
  todos: Todo[];
} & TodoItemEventHandlers;

const TodoList = ({
  todos,
  onChangeComplete,
  onChangeColor,
  onClickDelete,
}: TodoListProp): JSX.Element => {
  return (
    <ul aria-label={"list-todo"}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onChangeComplete={onChangeComplete}
          onChangeColor={onChangeColor}
          onClickDelete={onClickDelete}
        />
      ))}
    </ul>
  );
};

export default TodoList;
