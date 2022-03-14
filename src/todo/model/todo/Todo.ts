import { TODO_COLOR, TodoColor } from "../filter/TodoColors";
import { ulid } from "ulid";

export interface Todo {
  id: string;
  text: string;
  isCompleted: boolean;
  color: TodoColor;
}

export const createTodo = (newText: string): Todo => ({
  id: ulid(),
  text: newText,
  isCompleted: false,
  color: TODO_COLOR.None,
});
