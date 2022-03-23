import ActionsForTodos from "./ActionsForTodos";
import RemainingTodos from "./RemainingTodos";
import StatusFilter from "./StatusFilter";
import ColorFilter from "./ColorFilter";
import { TodoStatus } from "../model/filter/TodoStatus";
import { TodoColor } from "../model/filter/TodoColors";

interface OperatingTodosProps {
  numberOfTodos: number;
  curStatus: TodoStatus;
  onClickStatus: (status: TodoStatus) => void;
  curColors: TodoColor[];
  onChangeColor: (color: TodoColor, isSelected: boolean) => void;
  onClickMarkAllCompleted: () => void;
  onClickClearCompleted: () => void;
}

const OperatingTodos = ({
  numberOfTodos,
  curStatus,
  onClickStatus,
  curColors,
  onChangeColor,
  onClickMarkAllCompleted,
  onClickClearCompleted,
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
