import TodoItem from "./TodoItem";
import { TODO_STATUS } from "../filter/TodoStatus";
import { COLOR } from "../filter/Colors";

const TodoList = () => {
  return (
    <div>
      <ul>
        <TodoItem todoStatus={TODO_STATUS.ACTIVE} todoColor={COLOR.Red} />
      </ul>
    </div>
  );
};

export default TodoList;
