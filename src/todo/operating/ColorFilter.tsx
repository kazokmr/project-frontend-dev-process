import { TODO_COLOR, TodoColor, TodoColors } from "../model/filter/TodoColors";
import { useRecoilState } from "recoil";
import { colorsFilterState } from "../TodoApp";
import {
  Checkbox,
  Container,
  FormControlLabel,
  List,
  ListItem,
  Typography,
} from "@mui/material";

const ColorFilter = (): JSX.Element => {
  const [colors, setColors] = useRecoilState<TodoColor[]>(colorsFilterState);
  const updateColors = (changedColor: TodoColor, isChecked: boolean) => {
    if (isChecked && !colors.includes(changedColor)) {
      setColors([...colors, changedColor]);
    } else if (!isChecked && colors.includes(changedColor)) {
      setColors(colors.filter((color: TodoColor) => color !== changedColor));
    }
  };

  return (
    <Container>
      <Typography variant={"subtitle1"} gutterBottom={true}>
        Filter by Color
      </Typography>
      <List dense={true}>
        {TodoColors.filter((color) => color !== TODO_COLOR.None).map(
          (color) => (
            <ListItem key={color} disablePadding={true}>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: color,
                      "&.Mui-checked": { color: color },
                    }}
                    name={color}
                    checked={colors ? colors.includes(color) : false}
                    onChange={(event) =>
                      updateColors(color, event.target.checked)
                    }
                  />
                }
                label={color}
                sx={{ textTransform: "capitalize", color }}
              />
            </ListItem>
          )
        )}
      </List>
    </Container>
  );
};

export default ColorFilter;
