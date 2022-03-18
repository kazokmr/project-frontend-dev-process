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

  const updateColor = (id: string, changingColor: TodoColor) => {
    setTodos(
      todos.map((todo: Todo) =>
        todo.id !== id ? todo : { ...todo, color: changingColor }
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="todo-container">
      <NewTodo addTodo={addTodo} />
      <TodoList
        todos={todos}
        onChangeComplete={updateComplete}
        onChangeColor={updateColor}
        onClickDelete={deleteTodo}
      />
      <OperatingTodos numberOfTodos={todos.length} />
    </div>
  );
};

export default TodoApp;
