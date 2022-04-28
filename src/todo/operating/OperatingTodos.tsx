import ActionsForTodos from "./ActionsForTodos";
import RemainingTodos from "./RemainingTodos";
import StatusFilter from "./StatusFilter";
import ColorFilter from "./ColorFilter";
import { Box } from "@mui/material";

const OperatingTodos = (): JSX.Element => {
  return (
    <Box className="todo-footer">
      <ActionsForTodos />
      <RemainingTodos />
      <StatusFilter />
      <ColorFilter />
    </Box>
  );
};

export default OperatingTodos;
