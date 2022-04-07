import { DefaultRequestBody, PathParams, rest } from "msw";
import { Todo } from "../todo/model/todo/Todo";
import { TODO_COLOR, TodoColors } from "../todo/model/filter/TodoColors";

export const handlers = [
  rest.get<DefaultRequestBody, PathParams, Todo[]>(
    "/todos",
    (request, response, context) => {
      return response(context.status(200), context.json(createMockedTodos(3)));
    }
  ),
  rest.post<{ text: string }, PathParams, Todo>(
    "/addTodo",
    (req, res, context) => {
      const todo = new Todo(req.body.text);
      return res(context.status(200), context.json(todo));
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
