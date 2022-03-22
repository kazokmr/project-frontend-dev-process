import "./TodoApp.css";
import NewTodo from "./todoList/NewTodo";
import TodoList from "./todoList/TodoList";
import OperatingTodos from "./operating/OperatingTodos";
import { createTodo, Todo } from "./model/todo/Todo";
import { useEffect, useRef, useState } from "react";
import { TodoColor } from "./model/filter/TodoColors";
import { TODO_STATUS, TodoStatus } from "./model/filter/TodoStatus";

const TodoApp = () => {
  const isMountRef = useRef(false);
  const [todos, setTodos] = useState<Array<Todo>>([]);
  const [status, setStatus] = useState<TodoStatus>(TODO_STATUS.ALL);
  const [colors, setColors] = useState<TodoColor[]>([]);

  const fetchTodo = async () => {
    const result = await fetch("/todos");
    const todos: Todo[] = await result.json();
    if (isMountRef.current) {
      setTodos(todos);
    }
  };

  const selectTodo = () =>
    todos
      .filter(
        (todo) =>
          status === TODO_STATUS.ALL ||
          (status === TODO_STATUS.ACTIVE && !todo.isCompleted) ||
          (status === TODO_STATUS.COMPLETED && todo.isCompleted)
      )
      .filter((todo) => colors.length === 0 || colors.includes(todo.color));

  const addTodo = (text: string) => {
    const newTodo = createTodo(text);
    setTodos([...todos, newTodo]);
  };

  const updateComplete = (id: string) =>
    setTodos(
      todos.map((todo: Todo) =>
        todo.id !== id ? todo : { ...todo, isCompleted: !todo.isCompleted }
      )
    );

  const updateColor = (id: string, changingColor: TodoColor) =>
    setTodos(
      todos.map((todo: Todo) =>
        todo.id !== id ? todo : { ...todo, color: changingColor }
      )
    );

  const deleteTodo = (id: string) =>
    setTodos(todos.filter((todo) => todo.id !== id));

  const remainingTodos = () => todos.filter((todo) => !todo.isCompleted).length;

  const filterByStatus = (status: TodoStatus) => setStatus(status);

  const filterByColors = (color: TodoColor, isSelected: boolean) => {
    if (isSelected && !colors.includes(color)) {
      setColors([...colors, color]);
    }
    if (!isSelected && colors.includes(color)) {
      setColors(colors.filter((selColor) => selColor !== color));
    }
  };

  const completeAllTodos = () =>
    setTodos(
      todos.map((todo) =>
        todo.isCompleted ? todo : { ...todo, isCompleted: true }
      )
    );

  const clearCompleted = () =>
    setTodos(todos.filter((todo) => !todo.isCompleted));

  useEffect(() => {
    isMountRef.current = true;
    fetchTodo();
    return () => {
      isMountRef.current = false;
    };
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
        numberOfTodos={remainingTodos()}
        curStatus={status}
        onClickStatus={filterByStatus}
        curColors={colors}
        onChangeColor={filterByColors}
        onClickMarkAllCompleted={completeAllTodos}
        onClickClearCompleted={clearCompleted}
      />
    </div>
  );
};

export default TodoApp;
