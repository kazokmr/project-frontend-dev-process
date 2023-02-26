import { DefaultBodyType, PathParams, rest } from "msw";
import { Todo } from "../todo/model/todo/Todo";
import {
  TODO_COLOR,
  TodoColor,
  TodoColors,
} from "../todo/model/filter/TodoColors";
import { baseUrl } from "../todo/client/impl/RestClient";

let mockedTodos: Todo[] = [
  {
    id: "1",
    text: "君も今日もっとこの推薦性という事のためが参りですん。",
    isCompleted: true,
    color: TODO_COLOR.Red,
  },
  {
    id: "2",
    text: "主義を説きないのは無論事実でどうしてもたなた。",
    isCompleted: false,
    color: TODO_COLOR.Green,
  },
  {
    id: "3",
    text: "場合をはできるだけありて違ったんたでし",
    isCompleted: true,
    color: TODO_COLOR.Blue,
  },
  {
    id: "4",
    text: "引用欠くて、これらの.も色濃くでも係るますませ。",
    isCompleted: true,
    color: TODO_COLOR.Green,
  },
  {
    id: "5",
    text: "あるいは、ここを問題にすることを「侵害権」の投稿ある。",
    isCompleted: false,
    color: TODO_COLOR.None,
  },
];
export const handlers = [
  rest.get<DefaultBodyType, PathParams, Todo[]>(
    `${baseUrl}/todos`,
    (req, res, ctx) =>
      res(ctx.delay(300), ctx.status(200), ctx.json(mockedTodos))
  ),
  rest.post<{ text: string }, PathParams, Todo>(
    `${baseUrl}/todo`,
    async (req, res, ctx) => {
      const { text }: { text: string } = await req.json();
      const todo = new Todo(text);
      mockedTodos = [...mockedTodos, todo];
      return res(ctx.delay(300), ctx.status(200), ctx.json(todo));
    }
  ),
  rest.put<DefaultBodyType, { id: string }, Todo>(
    `${baseUrl}/todo/:id/complete`,
    (req, res, ctx) => {
      const { id } = req.params;
      mockedTodos = mockedTodos.map((todo: Todo) =>
        todo.id !== id ? todo : { ...todo, isCompleted: !todo.isCompleted }
      );
      // const todo = mockedTodos.find((todo: Todo) => todo.id === id);
      return res(ctx.delay(300), ctx.status(200));
    }
  ),
  rest.put<{ color: TodoColor }, { id: string }, Todo>(
    `${baseUrl}/todo/:id/changeColor`,
    async (req, res, ctx) => {
      const { id } = req.params;
      const { color }: { color: TodoColor } = await req.json();
      mockedTodos = mockedTodos.map((todo: Todo) =>
        todo.id !== id ? todo : { ...todo, color }
      );
      // const todo = mockedTodos.find((todo: Todo) => todo.id === id);
      return res(ctx.delay(300), ctx.status(200));
    }
  ),
  rest.delete<DefaultBodyType, { id: string }>(
    `${baseUrl}/todo/:id`,
    (req, res, ctx) => {
      const { id } = req.params;
      mockedTodos = mockedTodos.filter((todo: Todo) => todo.id !== id);
      return res(ctx.delay(300), ctx.status(204));
    }
  ),
  rest.put(`${baseUrl}/todo/completeAll`, (req, res, ctx) => {
    mockedTodos = mockedTodos.map((todo: Todo) => ({
      ...todo,
      isCompleted: true,
    }));
    return res(ctx.delay(300), ctx.status(200));
  }),
  rest.put(`${baseUrl}/todo/deleteCompleted`, (req, res, ctx) => {
    mockedTodos = mockedTodos.filter((todo: Todo) => !todo.isCompleted);
    return res(ctx.delay(300), ctx.status(200));
  }),
];

export function setMockedTodo(todos: Todo[]) {
  mockedTodos = todos;
}

export const createMockedTodos = (
  numberOfTodos: number,
  isInitCompleted = false,
  isInitColorTag = false
): Todo[] => {
  let todos: Todo[] = [];
  for (let number = 1; number <= numberOfTodos; number += 1) {
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
