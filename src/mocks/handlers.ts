import { DefaultBodyType, delay, http, HttpResponse, PathParams } from "msw";
import { Todo } from "../todo/model/todo/Todo";
import { TODO_COLOR, TodoColor, TodoColors } from "../todo/model/filter/TodoColors";
import { origin } from "../todo/client/impl/RestClient";

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
  http.get<PathParams, DefaultBodyType, Todo[]>(`${origin}/todos`, async () => {
    await delay(300);
    return HttpResponse.json(mockedTodos, { status: 200 });
  }),
  http.post<PathParams, { text: string }, Todo>(`${origin}/todo`, async ({ request }) => {
    const { text }: { text: string } = await request.json();
    const todo = new Todo(text);
    mockedTodos = [...mockedTodos, todo];
    await delay(300);
    return HttpResponse.json(todo, { status: 200 });
  }),
  http.put(`${origin}/todo/:id/complete`, async ({ params }) => {
    const { id } = params;
    mockedTodos = mockedTodos.map((todo: Todo) =>
      todo.id !== id ? todo : { ...todo, isCompleted: !todo.isCompleted },
    );
    await delay(300);
    return new HttpResponse(null, { status: 200 });
  }),
  http.put<PathParams, { color: TodoColor }>(`${origin}/todo/:id/changeColor`, async ({ request, params }) => {
    const { id } = params;
    const { color }: { color: TodoColor } = await request.json();
    mockedTodos = mockedTodos.map((todo: Todo) => (todo.id !== id ? todo : { ...todo, color }));
    await delay(300);
    return new HttpResponse(null, { status: 200 });
  }),
  http.delete(`${origin}/todo/:id`, async ({ params }) => {
    const { id } = params;
    mockedTodos = mockedTodos.filter((todo: Todo) => todo.id !== id);
    await delay(300);
    // Http Status 204 No Content の場合、response body に jsonオブジェクトをセットするとエラーになる
    return new HttpResponse(null, { status: 204 });
  }),
  http.put(`${origin}/todo/completeAll`, async () => {
    mockedTodos = mockedTodos.map((todo: Todo) => ({
      ...todo,
      isCompleted: true,
    }));
    await delay(300);
    return new HttpResponse(null, { status: 200 });
  }),
  http.put(`${origin}/todo/deleteCompleted`, async () => {
    mockedTodos = mockedTodos.filter((todo: Todo) => !todo.isCompleted);
    await delay(300);
    return new HttpResponse(null, { status: 200 });
  }),
];

export function setMockedTodo(todos: Todo[]) {
  mockedTodos = todos;
}

export const createMockedTodos = (numberOfTodos: number, isInitCompleted = false, isInitColorTag = false): Todo[] => {
  let todos: Todo[] = [];
  for (let number = 1; number <= numberOfTodos; number += 1) {
    const text = `これは ${number} のTodoです`;
    const isCompleted = isInitCompleted ? false : Math.random() >= 0.5;
    const color = isInitColorTag ? TODO_COLOR.None : TodoColors[Math.floor(Math.random() * TodoColors.length)];
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
