import ActionsForTodos from "./ActionsForTodos";
import RemainingTodos from "./RemainingTodos";
import StatusFilter from "./StatusFilter";
import ColorFilter from "./ColorFilter";

const OperatingTodos = () => {
  return (
    <div className="todo-footer">
      <ActionsForTodos />
      <RemainingTodos numOfTodo={1} />
      <StatusFilter status={undefined} />
      <ColorFilter curColors={undefined} />
    </div>
  );
};

export default OperatingTodos;
