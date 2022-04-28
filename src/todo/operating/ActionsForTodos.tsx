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
      <Container maxWidth={"md"}>
        <Typography variant={"subtitle1"}>Actions</Typography>
        <Stack spacing={2}>
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
    </Box>
  );
};

export default ActionsForTodos;
