import React from "react";
import {capitalize, Colors} from "../filter/Colors";

const ColorFilter = () => {
    return (
        <div>
            <h5>Filter by Color</h5>
            <ul>
                {Colors.map(color =>
                    <li>
                        <label>
                            <input type="checkbox" name={color} checked={false}/>
                            {capitalize(color)}
                        </label>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default ColorFilter;
