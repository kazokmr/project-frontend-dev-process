import { DefaultBodyType, delay, http, HttpResponse, PathParams } from "msw";
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
  http.get<PathParams, DefaultBodyType, Todo[]>(
    `${baseUrl}/todos`,
    async () => {
      await delay(300);
      return HttpResponse.json(mockedTodos, { status: 200 });
    },
  ),
  http.post<PathParams, { text: string }, Todo>(
    `${baseUrl}/todo`,
    async ({ request }) => {
      const { text }: { text: string } = await request.json();
      const todo = new Todo(text);
      mockedTodos = [...mockedTodos, todo];
      await delay(300);
      return HttpResponse.json(todo, { status: 200 });
    },
  ),
  http.put(`${baseUrl}/todo/:id/complete`, async ({ params }) => {
    const { id } = params;
    mockedTodos = mockedTodos.map((todo: Todo) =>
      todo.id !== id ? todo : { ...todo, isCompleted: !todo.isCompleted },
    );
    // const todo = mockedTodos.find((todo: Todo) => todo.id === id);
    await delay(300);
    return HttpResponse.json("", { status: 200 });
  }),
  http.put<PathParams, { color: TodoColor }>(
    `${baseUrl}/todo/:id/changeColor`,
    async ({ request, params }) => {
      const { id } = params;
      const { color }: { color: TodoColor } = await request.json();
      mockedTodos = mockedTodos.map((todo: Todo) =>
        todo.id !== id ? todo : { ...todo, color },
      );
      // const todo = mockedTodos.find((todo: Todo) => todo.id === id);
      await delay(300);
      return HttpResponse.json("", { status: 200 });
    },
  ),
  http.delete(`${baseUrl}/todo/:id`, async ({ params }) => {
    const { id } = params;
    mockedTodos = mockedTodos.filter((todo: Todo) => todo.id !== id);
    await delay(300);
    return HttpResponse.json("", { status: 204 });
  }),
  http.put(`${baseUrl}/todo/completeAll`, async () => {
    mockedTodos = mockedTodos.map((todo: Todo) => ({
      ...todo,
      isCompleted: true,
    }));
    await delay(300);
    return HttpResponse.json("", { status: 200 });
  }),
  http.put(`${baseUrl}/todo/deleteCompleted`, async () => {
    mockedTodos = mockedTodos.filter((todo: Todo) => !todo.isCompleted);
    await delay(300);
    return HttpResponse.json("", { status: 200 });
  }),
];

export function setMockedTodo(todos: Todo[]) {
  mockedTodos = todos;
}

export const createMockedTodos = (
  numberOfTodos: number,
  isInitCompleted = false,
  isInitColorTag = false,
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
