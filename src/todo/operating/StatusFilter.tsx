import { TODO_STATUS, TodoStatus } from "../model/filter/TodoStatus";
import { useRecoilState } from "recoil";
import { statusFilterState } from "../TodoApp";
import { Button, ButtonGroup, Container, Typography } from "@mui/material";

const StatusFilter = (): JSX.Element => {
  const [status, setStatus] = useRecoilState<TodoStatus>(statusFilterState);

  return (
    <Container maxWidth={"md"}>
      <Typography variant={"subtitle1"} gutterBottom={true}>
        Filter by Status
      </Typography>
      <ButtonGroup
        variant={"contained"}
        orientation={"vertical"}
        color={"secondary"}
      >
        <Button
          sx={{
            typography: "button",
            textTransform: "capitalize",
          }}
          aria-pressed={status === TODO_STATUS.ALL}
          onClick={() => setStatus(TODO_STATUS.ALL)}
        >
          {TODO_STATUS.ALL}
        </Button>
        <Button
          sx={{
            typography: "button",
            textTransform: "capitalize",
          }}
          aria-pressed={status === TODO_STATUS.ACTIVE}
          onClick={() => setStatus(TODO_STATUS.ACTIVE)}
        >
          {TODO_STATUS.ACTIVE}
        </Button>
        <Button
          sx={{
            typography: "button",
            textTransform: "capitalize",
          }}
          aria-pressed={status === TODO_STATUS.COMPLETED}
          onClick={() => setStatus(TODO_STATUS.COMPLETED)}
        >
          {TODO_STATUS.COMPLETED}
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default StatusFilter;
