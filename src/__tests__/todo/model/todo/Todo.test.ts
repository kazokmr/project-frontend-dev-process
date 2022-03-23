import { Todo } from "../../../../todo/model/todo/Todo";
import { TODO_COLOR } from "../../../../todo/model/filter/TodoColors";

describe("Todoの作成テスト", () => {
  test("TodoTextを渡すとIDにULIDをセットしてTodoオブジェクトを作成する", () => {
    const newText = "a new todo!";
    const todo: Todo = new Todo(newText);
    expect(todo.id).toMatch(/^[0-9A-Z]{26}$/);
    expect(todo.text).toBe(newText);
    expect(todo.isCompleted).toBeFalsy();
    expect(todo.color).toBe(TODO_COLOR.None);
  });

  test("IDは重複しないこと", () => {
    const todo1 = new Todo("This is a first Todo!");
    const todo2 = new Todo("This is a second Todo!");
    expect(todo1.id).not.toBe(todo2.id);
  });
});
