import {
  useMutationCompleteAllTodos,
  useMutationDeleteCompletedTodos,
} from "../hooks/useTodos";
import { Box, Button, Container, Stack, Typography } from "@mui/material";

const ActionsForTodos = (): JSX.Element => {
  const completeAllTodos = useMutationCompleteAllTodos();
  const deleteCompletedTodos = useMutationDeleteCompletedTodos();

  return (
    <Box>
      <Container>
        <Typography variant={"h5"} component={"h5"} align={"center"}>
          Actions
        </Typography>
        <Stack spacing={2}>
          <Button
            variant={"contained"}
            onClick={() => completeAllTodos.mutate()}
          >
            Mark All Completed
          </Button>
          <Button
            variant={"contained"}
            onClick={() => deleteCompletedTodos.mutate()}
          >
            Clear Completed
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default ActionsForTodos;
