import {capitalize, Colors} from "../filter/Colors";

const ColorFilter = ({curColors}: { curColors?: string[] }) => {
    return (
        <div>
            <h5>Filter by Color</h5>
            <ul>
                {Colors.map(color =>
                    <li key={color}>
                        <label>
                            <input
                                type="checkbox"
                                name={color}
                                checked={curColors?.includes(color)}
                                onChange={event => ""}
                            />
                            {capitalize(color)}
                        </label>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default ColorFilter;
