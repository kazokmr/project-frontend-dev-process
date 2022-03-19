import "./TodoApp.css";
import NewTodo from "./todoList/NewTodo";
import TodoList from "./todoList/TodoList";
import OperatingTodos from "./operating/OperatingTodos";
import { createTodo, Todo } from "./model/todo/Todo";
import { useEffect, useState } from "react";
import { TodoColor } from "./model/filter/TodoColors";

const TodoApp = () => {
  const [todos, setTodos] = useState<Array<Todo>>([]);

  const fetchTodo = async (): Promise<Todo[]> => {
    const res = await fetch("/todos");
    return await res.json();
  };

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

  const remainingTodos = () => todos.filter((todo) => !todo.isCompleted);

  useEffect(() => {
    fetchTodo()
      .then((todos) => setTodos(todos))
      .catch((error) => console.error(error.message));
  }, []);

  return (
    <div className="todo-container">
      <NewTodo addTodo={addTodo} />
      <TodoList
        todos={todos}
        onChangeComplete={updateComplete}
        onChangeColor={updateColor}
        onClickDelete={deleteTodo}
      />
      <OperatingTodos numberOfTodos={remainingTodos().length} />
    </div>
  );
};

export default TodoApp;
