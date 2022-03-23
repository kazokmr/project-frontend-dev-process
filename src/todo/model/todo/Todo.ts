import { TODO_COLOR, TodoColor } from "../filter/TodoColors";
import { ulid } from "ulid";

export class Todo {
  readonly id: string = ulid();
  readonly text: string;
  isCompleted: boolean = false;
  color: TodoColor = TODO_COLOR.None;

  constructor(text: string) {
    this.text = text;
  }
}
