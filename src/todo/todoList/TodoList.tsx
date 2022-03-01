import TodoItem from "./TodoItem";
import { Todo } from "../model/todo/Todo";

const TodoList = ({ todos }: { todos: Array<Todo> }) => {
  return (
    <ul data-testid={"todo-list"}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          text={todo.text}
          isCompleted={todo.isCompleted}
          color={todo.color}
        />
      ))}
    </ul>
  );
};

export default TodoList;
