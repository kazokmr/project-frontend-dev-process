import TodoItem from "./TodoItem";
import { Todo } from "../model/todo/Todo";
import { TodoColor } from "../model/filter/TodoColors";

const TodoList = ({
  todos,
  onChangeCompleteHandler,
  onChangeColorHandler,
}: {
  todos: Array<Todo>;
  onChangeCompleteHandler: (id: string) => void;
  onChangeColorHandler: (id: string, changingColor: TodoColor) => void;
}) => {
  return (
    <ul aria-label={"list-todo"}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onChangeCompleteHandler={onChangeCompleteHandler}
          onChangeColorHandler={onChangeColorHandler}
        />
      ))}
    </ul>
  );
};

export default TodoList;
