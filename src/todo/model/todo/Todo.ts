import { TodoColor } from "../filter/TodoColors";
import { ulid } from "ulid";

export interface Todo {
  id: string;
  text: string;
  isCompleted?: boolean | false;
  color?: TodoColor;
}

export const createTodo = (newText: string): Todo => ({
  id: ulid(),
  text: newText,
  isCompleted: false,
});
