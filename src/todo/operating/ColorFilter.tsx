import { ReactElement } from "react";
import { useRecoilState } from "recoil";
import {
  Checkbox,
  Container,
  FormControlLabel,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { TODO_COLOR, TodoColor, TodoColors } from "../model/filter/TodoColors";
import { colorsFilterState } from "../hooks/useTodos";

const ColorFilter = (): ReactElement => {
  const [colors, setColors] = useRecoilState<TodoColor[]>(colorsFilterState);
  const updateColors = (changedColor: TodoColor, isChecked: boolean) => {
    if (isChecked && !colors.includes(changedColor)) {
      setColors([...colors, changedColor]);
    } else if (!isChecked && colors.includes(changedColor)) {
      setColors(colors.filter((color: TodoColor) => color !== changedColor));
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="subtitle1" gutterBottom>
        Filter by Color
      </Typography>
      <List dense>
        {TodoColors.filter((color) => color !== TODO_COLOR.None).map(
          (color) => (
            <ListItem key={color} disablePadding>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color,
                      "&.Mui-checked": { color },
                    }}
                    name={color}
                    checked={colors.includes(color)}
                    onChange={(event) =>
                      updateColors(color, event.target.checked)
                    }
                  />
                }
                label={color}
                sx={{ textTransform: "capitalize", color }}
              />
            </ListItem>
          ),
        )}
      </List>
    </Container>
  );
};

export default ColorFilter;
