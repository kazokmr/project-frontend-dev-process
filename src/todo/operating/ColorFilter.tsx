import React from "react";

const ColorFilter = () => {
    return (
        <div>
            <h5>Filter by Color</h5>
            <div>
                <label>
                    <input type="checkbox" name={"green"} checked={false}/>
                    Green
                </label>
            </div>
        </div>
    );
}

export default ColorFilter;
