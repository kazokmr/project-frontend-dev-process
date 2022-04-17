import { TODO_COLOR, TodoColor, TodoColors } from "../model/filter/TodoColors";
import { capitalize } from "../model/filter/StringCapitalization";
import { useQueryClient } from "react-query";
import { useQueryColors } from "../hooks/useTodos";

const ColorFilter = (): JSX.Element => {
  const curColors = useQueryColors();
  const queryClient = useQueryClient();
  const setColors = (color: TodoColor, isChecked: boolean) => {
    if (isChecked && !curColors.includes(color)) {
      queryClient.setQueryData<TodoColor[]>("colors", [...curColors, color]);
    } else if (!isChecked && curColors.includes(color)) {
      queryClient.setQueryData<TodoColor[]>(
        "colors",
        curColors.filter((curColor: TodoColor) => curColor !== color)
      );
    }
  };

  return (
    <div>
      <h5>Filter by Color</h5>
      <ul>
        {TodoColors.filter((color) => color !== TODO_COLOR.None).map(
          (color) => (
            <li key={color}>
              <label>
                <input
                  type="checkbox"
                  name={color}
                  checked={curColors ? curColors.includes(color) : false}
                  onChange={(event) => setColors(color, event.target.checked)}
                />
                {capitalize(color)}
              </label>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default ColorFilter;
