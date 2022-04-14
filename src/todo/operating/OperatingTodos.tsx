import ActionsForTodos from "./ActionsForTodos";
import RemainingTodos from "./RemainingTodos";
import StatusFilter from "./StatusFilter";
import ColorFilter from "./ColorFilter";

const OperatingTodos = (): JSX.Element => {
  return (
    <div className="todo-footer">
      <ActionsForTodos />
      <RemainingTodos />
      <StatusFilter />
      <ColorFilter />
    </div>
  );
};

export default OperatingTodos;
