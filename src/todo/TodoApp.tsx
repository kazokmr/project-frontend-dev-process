import "./TodoApp.css";
import NewTodo from "./todoList/NewTodo";
import TodoList from "./todoList/TodoList";
import OperatingTodos from "./operating/OperatingTodos";
import { createTodo, Todo } from "./model/todo/Todo";
import { useState } from "react";

const TodoApp = () => {
  const [todos, setTodos] = useState<Array<Todo>>([]);
  const addTodo = (text: string) => {
    const newTodo = createTodo(text);
    setTodos([...todos, newTodo]);
  };
  const updateComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id !== id ? todo : { ...todo, isCompleted: !todo.isCompleted }
      )
    );
  };

  return (
    <div className="todo-container">
      <NewTodo addTodo={addTodo} />
      <TodoList todos={todos} updateComplete={updateComplete} />
      <OperatingTodos />
    </div>
  );
};

export default TodoApp;
