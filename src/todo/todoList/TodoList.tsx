import TodoItem, { TodoItemEventHandlers } from "./TodoItem";
import { Todo } from "../model/todo/Todo";

interface TodoListProp {
  todos: Todo[];
  handlers: TodoItemEventHandlers;
}

const TodoList = ({ todos, handlers }: TodoListProp): JSX.Element => {
  return (
    <ul aria-label={"list-todo"}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} handlers={handlers} />
      ))}
    </ul>
  );
};

export default TodoList;
