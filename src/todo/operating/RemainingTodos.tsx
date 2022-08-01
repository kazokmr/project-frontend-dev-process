import { Container, Typography } from "@mui/material";
import { useRemainingTodos } from "../hooks/useTodos";

const RemainingTodos = (): JSX.Element => {
  const numOfTodo = useRemainingTodos().data ?? 0;

  return (
    <Container maxWidth="md">
      <Typography variant="subtitle1" gutterBottom>
        Remaining Todos
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontWeight: "bold" }}
        data-testid="remaining-todos"
      >
        {`${numOfTodo} item${numOfTodo > 1 ? "s" : ""} left`}
      </Typography>
    </Container>
  );
};

export default RemainingTodos;
