import ActionsForTodos from "./ActionsForTodos";
import RemainingTodos from "./RemainingTodos";
import StatusFilter from "./StatusFilter";
import ColorFilter from "./ColorFilter";
import { FC } from "react";

interface OperatingTodosProps {
  numberOfTodos: number;
}

const OperatingTodos: FC<OperatingTodosProps> = ({ numberOfTodos }) => {
  return (
    <div className="todo-footer">
      <ActionsForTodos />
      <RemainingTodos numOfTodo={numberOfTodos} />
      <StatusFilter curStatus={undefined} />
      <ColorFilter curColors={undefined} />
    </div>
  );
};

export default OperatingTodos;
