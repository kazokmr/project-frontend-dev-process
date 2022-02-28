import { TodoStatus } from "../filter/TodoStatus";
import { TodoColor } from "../filter/TodoColors";

export interface Todo {
  text: string;
  status: TodoStatus;
  color?: TodoColor;
}
