import React from "react";

const TodoItem = () => {
    return (
        <li className="todo">
            <div>
                <input
                    type="checkbox"
                />
            </div>
            <div>
                todo
            </div>
            <div>
                <select>
                    <option value=""/>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="orange">Orange</option>
                    <option value="purple">Purple</option>
                    <option value="red">Red</option>
                </select>
            </div>
            <div>
                X
            </div>
        </li>
    );
};

export default TodoItem;
