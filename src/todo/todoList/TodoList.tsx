import TodoItem from "./TodoItem";
import { TODO_STATUS } from "../model/filter/TodoStatus";
import { TODO_COLOR } from "../model/filter/TodoColors";

const TodoList = () => {
  return (
    <div>
      <ul>
        <TodoItem
          text={"DEMO"}
          status={TODO_STATUS.ACTIVE}
          color={TODO_COLOR.Red}
        />
      </ul>
    </div>
  );
};

export default TodoList;
