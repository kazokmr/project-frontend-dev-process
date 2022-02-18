import React from "react";
import "./TodoApp.css"
import NewTodo from "./todoList/NewTodo";
import TodoList from "./todoList/TodoList";
import OperatingTodos from "./operating/OperatingTodos";

const TodoApp = () => {
    return (
        <div className="todo-container">
            <NewTodo/>
            <TodoList/>
            <OperatingTodos/>
        </div>
    );
}

export default TodoApp;
