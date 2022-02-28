import TodoItem from "./TodoItem";
import { TODO_STATUS } from "../filter/TodoStatus";
import { TODO_COLOR } from "../filter/TodoColors";

const TodoList = () => {
  return (
    <div>
      <ul>
        <TodoItem
          todoText={"DEMO"}
          todoStatus={TODO_STATUS.ACTIVE}
          todoColor={TODO_COLOR.Red}
        />
      </ul>
    </div>
  );
};

export default TodoList;
