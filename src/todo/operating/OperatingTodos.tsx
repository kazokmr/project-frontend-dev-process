import ActionsForTodos from "./ActionsForTodos";
import RemainingTodos from "./RemainingTodos";
import StatusFilter from "./StatusFilter";
import ColorFilter from "./ColorFilter";
import { FC } from "react";
import { TodoStatus } from "../model/filter/TodoStatus";

interface OperatingTodosProps {
  numberOfTodos: number;
  curStatus: TodoStatus;
  onClickStatus: (status: TodoStatus) => void;
}

const OperatingTodos: FC<OperatingTodosProps> = ({
  numberOfTodos,
  curStatus,
  onClickStatus,
}) => {
  return (
    <div className="todo-footer">
      <ActionsForTodos />
      <RemainingTodos numOfTodo={numberOfTodos} />
      <StatusFilter curStatus={curStatus} onClickStatus={onClickStatus} />
      <ColorFilter curColors={undefined} />
    </div>
  );
};

export default OperatingTodos;
