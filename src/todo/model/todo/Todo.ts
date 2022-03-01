import { TodoColor } from "../filter/TodoColors";

export interface Todo {
  id: string;
  text: string;
  isCompleted?: boolean | false;
  color?: TodoColor;
}
