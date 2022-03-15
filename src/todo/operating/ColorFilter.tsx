import { TODO_COLOR, TodoColor, TodoColors } from "../model/filter/TodoColors";
import { capitalize } from "../model/filter/StringCapitalization";

const ColorFilter = ({ curColors }: { curColors?: Array<TodoColor> }) => {
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
                  onChange={(event) => ""}
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
