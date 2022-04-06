import "./TodoApp.css";
import NewTodo from "./todoList/NewTodo";
import TodoList from "./todoList/TodoList";
import OperatingTodos from "./operating/OperatingTodos";
import { Todo } from "./model/todo/Todo";
import { useEffect, useRef, useState } from "react";
import { TodoColor } from "./model/filter/TodoColors";
import { TODO_STATUS, TodoStatus } from "./model/filter/TodoStatus";
import axios from "axios";

const TodoApp = (): JSX.Element => {
  const isMountRef = useRef<boolean>(false);
  const [todos, setTodos] = useState<Todo[]>([] as Todo[]);
  const [status, setStatus] = useState<TodoStatus>(TODO_STATUS.ALL);
  const [colors, setColors] = useState<TodoColor[]>([] as TodoColor[]);

  const fetchTodo = async (): Promise<void> => {
    const response = await axios.get("/todos");
    const todos: Todo[] = response.data;
    if (isMountRef.current) {
      setTodos(todos);
    }
  };

  const selectTodo: Todo[] = todos
    .filter(
      (todo) =>
        status === TODO_STATUS.ALL ||
        (status === TODO_STATUS.ACTIVE && !todo.isCompleted) ||
        (status === TODO_STATUS.COMPLETED && todo.isCompleted)
    )
    .filter((todo) => colors.length === 0 || colors.includes(todo.color));

  const addTodo = (text: string): void => {
    const todo = new Todo(text);
    setTodos([...todos, todo]);
  };

  const updateComplete = (id: string): void =>
    setTodos(
      todos.map((todo: Todo) =>
        todo.id !== id ? todo : { ...todo, isCompleted: !todo.isCompleted }
      )
    );

  const updateColor = (id: string, changingColor: TodoColor): void =>
    setTodos(
      todos.map((todo: Todo) =>
        todo.id !== id ? todo : { ...todo, color: changingColor }
      )
    );

  const deleteTodo = (id: string): void =>
    setTodos(todos.filter((todo) => todo.id !== id));

  const remainingTodos: number = todos.filter(
    (todo) => !todo.isCompleted
  ).length;

  const filterByStatus = (status: TodoStatus): void => setStatus(status);

  const filterByColors = (color: TodoColor, isSelected: boolean): void => {
    if (isSelected && !colors.includes(color)) {
      setColors([...colors, color]);
    }
    if (!isSelected && colors.includes(color)) {
      setColors(colors.filter((selColor) => selColor !== color));
    }
  };

  const completeAllTodos = (): void =>
    setTodos(
      todos.map((todo) =>
        todo.isCompleted ? todo : { ...todo, isCompleted: true }
      )
    );

  const clearCompleted = (): void =>
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
        todos={selectTodo}
        onChangeComplete={updateComplete}
        onChangeColor={updateColor}
        onClickDelete={deleteTodo}
      />
      <OperatingTodos
        onClickMarkAllCompleted={completeAllTodos}
        onClickClearCompleted={clearCompleted}
        numberOfTodos={remainingTodos}
        curStatus={status}
        onClickStatus={filterByStatus}
        curColors={colors}
        onChangeColor={filterByColors}
      />
    </div>
  );
};

export default TodoApp;
