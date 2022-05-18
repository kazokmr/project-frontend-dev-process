import { DefaultBodyType, PathParams, rest } from "msw";
import { Todo } from "../todo/model/todo/Todo";
import {
  TODO_COLOR,
  TodoColor,
  TodoColors,
} from "../todo/model/filter/TodoColors";

export const handlers = [
  rest.get<DefaultBodyType, PathParams, Todo[]>("/todos", (req, res, ctx) => {
    return res(ctx.delay(300), ctx.status(200), ctx.json(mockedTodos));
  }),
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
  rest.delete<{ id: string }, PathParams, DefaultBodyType>(
    "/todo/:id",
    (req, res, ctx) => {
      const { id } = req.params;
      mockedTodos = mockedTodos.filter((todo: Todo) => todo.id !== id);
      return res(ctx.delay(300), ctx.status(204));
    }
  ),
  rest.put<DefaultBodyType, PathParams, DefaultBodyType>(
    "/todo/completeAll",
    (req, res, ctx) => {
      mockedTodos = mockedTodos.map((todo: Todo) => ({
        ...todo,
        isCompleted: true,
      }));
      return res(ctx.delay(300), ctx.status(200));
    }
  ),
  rest.put<DefaultBodyType, PathParams, DefaultBodyType>(
    "/todo/deleteCompleted",
    (req, res, ctx) => {
      mockedTodos = mockedTodos.filter((todo: Todo) => !todo.isCompleted);
      return res(ctx.delay(300), ctx.status(200));
    }
  ),
];

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

export function setMockedTodo(todos: Todo[]) {
  mockedTodos = todos;
}

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
