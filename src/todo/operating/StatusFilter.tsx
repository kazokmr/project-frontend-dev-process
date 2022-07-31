import { useRecoilState } from "recoil";
import {
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography
} from "@mui/material";
import { ChangeEvent } from "react";
import { statusFilterState } from "../hooks/useTodos";
import { TODO_STATUS, TodoStatus } from "../model/filter/TodoStatus";

const StatusFilter = (): JSX.Element => {
  const [status, setStatus] = useRecoilState<TodoStatus>(statusFilterState);

  return (
    <Container maxWidth="md">
      <FormControl>
        <Typography variant="subtitle1" gutterBottom>
          Filter by Status
        </Typography>
        <RadioGroup
          value={status}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setStatus(event.target.value as TodoStatus)
          }
        >
          <FormControlLabel
            control={<Radio />}
            value={TODO_STATUS.ALL}
            label={TODO_STATUS.ALL}
          />
          <FormControlLabel
            control={<Radio />}
            value={TODO_STATUS.ACTIVE}
            label={TODO_STATUS.ACTIVE}
          />
          <FormControlLabel
            control={<Radio />}
            value={TODO_STATUS.COMPLETED}
            label={TODO_STATUS.COMPLETED}
          />
        </RadioGroup>
      </FormControl>
    </Container>
  );
};

export default StatusFilter;
