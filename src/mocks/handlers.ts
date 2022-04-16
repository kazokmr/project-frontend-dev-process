import { DefaultRequestBody, PathParams, rest } from "msw";
import { Todo } from "../todo/model/todo/Todo";
import {
  TODO_COLOR,
  TodoColor,
  TodoColors,
} from "../todo/model/filter/TodoColors";

export const handlers = [
  rest.get<DefaultRequestBody, PathParams, Todo[]>(
    "/todos",
    (req, res, ctx) => {
      return res(ctx.delay(300), ctx.status(200), ctx.json(mockedTodos));
    }
  ),
  rest.post<{ text: string }, PathParams, Todo>("/todo", (req, res, ctx) => {
    const todo = new Todo(req.body.text);
    mockedTodos = [...mockedTodos, todo];
    return res(ctx.delay(300), ctx.status(200), ctx.json(todo));
  }),
  rest.put<{ id: string }, PathParams, Todo>(
    "/todo/:id/complete",
    (req, res, ctx) => {
      const { id } = req.params;
      mockedTodos = mockedTodos.map((todo: Todo) =>
        todo.id !== id ? todo : { ...todo, isCompleted: !todo.isCompleted }
      );
      // const todo = mockedTodos.find((todo: Todo) => todo.id === id);
      return res(ctx.delay(300), ctx.status(200));
    }
  ),
  rest.put<{ id: string; color: TodoColor }, PathParams, Todo>(
    "/todo/:id/changeColor",
    (req, res, ctx) => {
      const { id } = req.params;
      mockedTodos = mockedTodos.map((todo: Todo) =>
        todo.id !== id ? todo : { ...todo, color: req.body.color }
      );
      // const todo = mockedTodos.find((todo: Todo) => todo.id === id);
      return res(ctx.delay(300), ctx.status(200));
    }
  ),
  rest.delete<{ id: string }, PathParams, DefaultRequestBody>(
    "/todo/:id",
    (req, res, ctx) => {
      const { id } = req.params;
      mockedTodos = mockedTodos.filter((todo: Todo) => todo.id !== id);
      return res(ctx.delay(300), ctx.status(204));
    }
  ),
  rest.put<DefaultRequestBody, PathParams, DefaultRequestBody>(
    "/todo/completeAll",
    (req, res, ctx) => {
      mockedTodos = mockedTodos.map((todo: Todo) => ({
        ...todo,
        isCompleted: true,
      }));
      return res(ctx.delay(300), ctx.status(200));
    }
  ),
  rest.put<DefaultRequestBody, PathParams, DefaultRequestBody>(
    "/todo/deleteCompleted",
    (req, res, ctx) => {
      mockedTodos = mockedTodos.filter((todo: Todo) => !todo.isCompleted);
      return res(ctx.delay(300), ctx.status(200));
    }
  ),
];

export const createMockedTodos = (
  numberOfTodos: number,
  isInitCompleted: boolean = false,
  isInitColorTag: boolean = false
): Todo[] => {
  let todos: Todo[] = [];
  for (let number = 1; number <= numberOfTodos; number++) {
    const text = `これは ${number} のTodoです`;
    const isCompleted = isInitCompleted ? false : Math.random() >= 0.5;
    const color = isInitColorTag
      ? TODO_COLOR.None
      : TodoColors[Math.floor(Math.random() * TodoColors.length)];
    const newTodo: Todo = {
      id: number.toString(),
      text,
      isCompleted,
      color,
    };
    todos = [...todos, newTodo];
  }
  return todos;
};

let mockedTodos = createMockedTodos(5);

export function setMockedTodo(todos: Todo[]) {
  mockedTodos = todos;
}
