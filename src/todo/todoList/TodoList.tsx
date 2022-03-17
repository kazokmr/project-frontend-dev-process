import TodoItem, { TodoItemEventHandlers } from "./TodoItem";
import { Todo } from "../model/todo/Todo";
import { FC } from "react";

type TodoListProp = {
  todos: Todo[];
} & TodoItemEventHandlers;

const TodoList: FC<TodoListProp> = ({
  todos,
  onChangeComplete,
  onChangeColor,
  onClickDelete,
}) => {
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
