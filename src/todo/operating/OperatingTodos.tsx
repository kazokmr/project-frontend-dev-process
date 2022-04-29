import ActionsForTodos from "./ActionsForTodos";
import RemainingTodos from "./RemainingTodos";
import StatusFilter from "./StatusFilter";
import ColorFilter from "./ColorFilter";
import { Grid } from "@mui/material";

const OperatingTodos = (): JSX.Element => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={6} sm={3}>
        <ActionsForTodos />
      </Grid>
      <Grid item xs={6} sm={3}>
        <RemainingTodos />
      </Grid>
      <Grid item xs={6} sm={3}>
        <StatusFilter />
      </Grid>
      <Grid item xs={6} sm={3}>
        <ColorFilter />
      </Grid>
    </Grid>
  );
};

export default OperatingTodos;
