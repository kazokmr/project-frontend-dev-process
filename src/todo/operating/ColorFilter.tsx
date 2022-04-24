import { TODO_COLOR, TodoColor, TodoColors } from "../model/filter/TodoColors";
import { capitalize } from "../model/filter/StringCapitalization";
import { useRecoilState } from "recoil";
import { colorsFilterState } from "../TodoApp";

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
                  checked={colors ? colors.includes(color) : false}
                  onChange={(event) =>
                    updateColors(color, event.target.checked)
                  }
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
