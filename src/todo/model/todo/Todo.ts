import { TodoStatus } from "../filter/TodoStatus";
import { TodoColor } from "../filter/TodoColors";

export interface Todo {
  id: string;
  text: string;
  status: TodoStatus;
  color?: TodoColor;
}
