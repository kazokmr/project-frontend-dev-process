import { Todo } from "../model/todo/Todo";
import { TodoColor } from "../model/filter/TodoColors";

export interface HttpClient {
  queryTodos: () => Promise<Todo[]>;
  addTodo: (text: string) => Promise<Todo>;
  completeTodo: (id: string) => Promise<void>;
  changeColor: (id: string, color: TodoColor) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  completeAllTodos: () => Promise<void>;
  deleteCompletedTodos: () => Promise<void>;
}
