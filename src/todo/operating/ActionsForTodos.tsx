import { ReactElement } from "react";
import { Button, Container, Stack, Typography } from "@mui/material";
import {
  useMutationCompleteAllTodos,
  useMutationDeleteCompletedTodos,
} from "../hooks/useTodos";

const ActionsForTodos = (): ReactElement => {
  const completeAllTodos = useMutationCompleteAllTodos();
  const deleteCompletedTodos = useMutationDeleteCompletedTodos();

  return (
    <Container maxWidth="md">
      <Typography variant="subtitle1" gutterBottom>
        Actions
      </Typography>
      <Stack direction="column" spacing={2}>
        <Button
          variant="contained"
          sx={{
            typography: "button",
            textTransform: "capitalize",
          }}
          onClick={() => completeAllTodos.mutate()}
        >
          Mark All Completed
        </Button>
        <Button
          variant="contained"
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
