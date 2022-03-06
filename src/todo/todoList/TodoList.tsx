import TodoItem from "./TodoItem";
import { Todo } from "../model/todo/Todo";

const TodoList = ({
  todos,
  updateComplete,
}: {
  todos: Array<Todo>;
  updateComplete: (id: string) => void;
}) => {
  return (
    <ul aria-label={"list-todo"}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} updateComplete={updateComplete} />
      ))}
    </ul>
  );
};

export default TodoList;
