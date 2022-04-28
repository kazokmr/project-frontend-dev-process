import { useRemainingTodos } from "../hooks/useTodos";
import { Box, Container, Typography } from "@mui/material";

const RemainingTodos = (): JSX.Element => {
  const numOfTodo = useRemainingTodos().data ?? 0;

  return (
    <Box>
      <Container maxWidth={"md"}>
        <Typography variant={"subtitle1"}>Remaining Todos</Typography>
        <Typography
          variant={"body1"}
          sx={{ fontWeight: "bold" }}
          data-testid={"remaining-todos"}
        >
          {`${numOfTodo} item${numOfTodo > 1 ? "s" : ""} left`}
        </Typography>
      </Container>
    </Box>
  );
};

export default RemainingTodos;
