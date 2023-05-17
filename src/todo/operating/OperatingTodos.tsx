import { ReactElement } from "react";
import { Grid } from "@mui/material";
import ActionsForTodos from "./ActionsForTodos";
import RemainingTodos from "./RemainingTodos";
import StatusFilter from "./StatusFilter";
import ColorFilter from "./ColorFilter";

const OperatingTodos = (): ReactElement => (
  <Grid container>
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

export default OperatingTodos;
