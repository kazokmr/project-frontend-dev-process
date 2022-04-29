import { useRemainingTodos } from "../hooks/useTodos";
import { Container, Typography } from "@mui/material";

const RemainingTodos = (): JSX.Element => {
  const numOfTodo = useRemainingTodos().data ?? 0;

  return (
    <Container>
      <Typography variant={"subtitle1"} gutterBottom={true}>
        Remaining Todos
      </Typography>
      <Typography
        variant={"body1"}
        sx={{ fontWeight: "bold" }}
        data-testid={"remaining-todos"}
      >
        {`${numOfTodo} item${numOfTodo > 1 ? "s" : ""} left`}
      </Typography>
    </Container>
  );
};

export default RemainingTodos;
