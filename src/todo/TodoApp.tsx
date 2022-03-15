import "./TodoApp.css";
import NewTodo from "./todoList/NewTodo";
import TodoList from "./todoList/TodoList";
import OperatingTodos from "./operating/OperatingTodos";
import { createTodo, Todo } from "./model/todo/Todo";
import { useState } from "react";
import { TodoColor } from "./model/filter/TodoColors";

const TodoApp = () => {
  const [todos, setTodos] = useState<Array<Todo>>([]);

  const addTodo = (text: string) => {
    const newTodo = createTodo(text);
    setTodos([...todos, newTodo]);
  };

  const updateComplete = (id: string) => {
    setTodos(
      todos.map((todo: Todo) =>
        todo.id !== id ? todo : { ...todo, isCompleted: !todo.isCompleted }
      )
    );
  };

  const updateColor = (id: string, color: TodoColor) => {
    setTodos(
      todos.map((todo: Todo) => (todo.id !== id ? todo : { ...todo, color }))
    );
  };

  return (
    <div className="todo-container">
      <NewTodo addTodo={addTodo} />
      <TodoList
        todos={todos}
        onChangeCompleteHandler={updateComplete}
        onChangeColorHandler={updateColor}
      />
      <OperatingTodos />
    </div>
  );
};

export default TodoApp;
