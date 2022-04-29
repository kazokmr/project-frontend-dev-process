import {
  useMutationCompleteAllTodos,
  useMutationDeleteCompletedTodos,
} from "../hooks/useTodos";
import { Button, Container, Stack, Typography } from "@mui/material";

const ActionsForTodos = (): JSX.Element => {
  const completeAllTodos = useMutationCompleteAllTodos();
  const deleteCompletedTodos = useMutationDeleteCompletedTodos();

  return (
    <Container>
      <Typography variant={"subtitle1"} gutterBottom={true}>
        Actions
      </Typography>
      <Stack direction={"column"} spacing={2}>
        <Button
          variant={"contained"}
          sx={{
            typography: "button",
            textTransform: "capitalize",
          }}
          onClick={() => completeAllTodos.mutate()}
        >
          Mark All Completed
        </Button>
        <Button
          variant={"contained"}
          sx={{
            typography: "button",
            textTransform: "capitalize",
          }}
          onClick={() => deleteCompletedTodos.mutate()}
        >
          Clear Completed
        </Button>
      </Stack>
    </Container>
  );
};

export default ActionsForTodos;
