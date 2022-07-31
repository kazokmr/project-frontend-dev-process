import { ulid } from "ulid";
import { TODO_COLOR, TodoColor } from "../filter/TodoColors";

export class Todo {
  readonly id: string = ulid();

  readonly text: string;

  isCompleted = false;

  color: TodoColor = TODO_COLOR.None;

  constructor(text: string) {
    this.text = text;
  }
}
