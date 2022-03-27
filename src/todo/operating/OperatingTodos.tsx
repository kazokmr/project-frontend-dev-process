import ActionsForTodos from "./ActionsForTodos";
import RemainingTodos from "./RemainingTodos";
import StatusFilter from "./StatusFilter";
import ColorFilter from "./ColorFilter";
import { TodoColor } from "../model/filter/TodoColors";
import { TodoStatus } from "../model/filter/TodoStatus";

interface OperatingTodosProps {
  onClickMarkAllCompleted: () => void;
  onClickClearCompleted: () => void;
  numberOfTodos: number;
  curStatus: TodoStatus;
  onClickStatus: (status: TodoStatus) => void;
  curColors: TodoColor[];
  onChangeColor: (color: TodoColor, isSelected: boolean) => void;
}

const OperatingTodos = ({
  onClickMarkAllCompleted,
  onClickClearCompleted,
  numberOfTodos,
  curStatus,
  onClickStatus,
  curColors,
  onChangeColor,
}: OperatingTodosProps): JSX.Element => {
  return (
    <div className="todo-footer">
      <ActionsForTodos
        onClickMarkAllCompleted={onClickMarkAllCompleted}
        onClickClearCompleted={onClickClearCompleted}
      />
      <RemainingTodos numOfTodo={numberOfTodos} />
      <StatusFilter curStatus={curStatus} onClickStatus={onClickStatus} />
      <ColorFilter curColors={curColors} onChangeColor={onChangeColor} />
    </div>
  );
};

export default OperatingTodos;
