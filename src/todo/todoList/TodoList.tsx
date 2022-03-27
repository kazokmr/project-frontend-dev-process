import TodoItem, { TodoItemEventHandlers } from "./TodoItem";
import { Todo } from "../model/todo/Todo";

interface TodoListProp {
  todos: Todo[];
}

const TodoList = ({
  todos,
  onChangeColor,
  onChangeComplete,
  onClickDelete,
}: TodoListProp & TodoItemEventHandlers): JSX.Element => {
  return (
    <ul aria-label={"list-todo"}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onChangeColor={onChangeColor}
          onChangeComplete={onChangeComplete}
          onClickDelete={onClickDelete}
        />
      ))}
    </ul>
  );
};

export default TodoList;
