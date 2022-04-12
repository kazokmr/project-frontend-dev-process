import { TODO_COLOR, TodoColor, TodoColors } from "../model/filter/TodoColors";
import { capitalize } from "../model/filter/StringCapitalization";
import { useQueryClient } from "react-query";

const ColorFilter = (): JSX.Element => {
  const queryClient = useQueryClient();
  const curColors = queryClient.getQueryData<TodoColor[]>(["colors"]);
  const setColors = (color: TodoColor, isChecked: boolean) => {
    if (isChecked && !curColors?.includes(color)) {
      queryClient.setQueryData<TodoColor[]>(
        ["colors"],
        curColors ? [...curColors, color] : [color]
      );
    } else if (!isChecked && curColors?.includes(color)) {
      queryClient.setQueryData<TodoColor[]>(
        ["colors"],
        curColors?.filter((curColor) => curColor !== color)
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
