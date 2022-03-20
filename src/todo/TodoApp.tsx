import "./TodoApp.css";
import NewTodo from "./todoList/NewTodo";
import TodoList from "./todoList/TodoList";
import OperatingTodos from "./operating/OperatingTodos";
import { createTodo, Todo } from "./model/todo/Todo";
import { useEffect, useState } from "react";
import { TodoColor } from "./model/filter/TodoColors";
import { TODO_STATUS, TodoStatus } from "./model/filter/TodoStatus";

const TodoApp = () => {
  const [todos, setTodos] = useState<Array<Todo>>([]);
  const [status, setStatus] = useState<TodoStatus>(TODO_STATUS.ALL);

  const fetchTodo = (): Promise<Todo[]> =>
    fetch("/todos").then((res) => res.json());

  const selectTodo = () =>
    todos.filter((todo) => {
      switch (status) {
        case "active":
          return !todo.isCompleted;
        case "completed":
          return todo.isCompleted;
        default:
          return true;
      }
    });

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

  const filterByStatus = (status: TodoStatus) => setStatus(status);

  useEffect(() => {
    fetchTodo()
      .then((todos) => setTodos(todos))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="todo-container">
      <NewTodo addTodo={addTodo} />
      <TodoList
        todos={selectTodo()}
        onChangeComplete={updateComplete}
        onChangeColor={updateColor}
        onClickDelete={deleteTodo}
      />
      <OperatingTodos
        numberOfTodos={remainingTodos().length}
        curStatus={status}
        onClickStatus={filterByStatus}
      />
    </div>
  );
};

export default TodoApp;
