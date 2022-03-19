import { rest } from "msw";
import { Todo } from "../todo/model/todo/Todo";
import { TODO_COLOR } from "../todo/model/filter/TodoColors";

export const handlers = [
  rest.get("/todos", (request, response, context) => {
    return response(context.status(200), context.json(todos));
  }),
];

const todos: Todo[] = [
  {
    id: "test-1",
    text: "１つ目のTodoです",
    isCompleted: false,
    color: TODO_COLOR.Green,
  },
  {
    id: "test-2",
    text: "２つ目のTodoです",
    isCompleted: true,
    color: TODO_COLOR.None,
  },
  {
    id: "test-3",
    text: "３つ目のTodoです",
    isCompleted: false,
    color: TODO_COLOR.Blue,
  },
];
