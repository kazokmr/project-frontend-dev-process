import { createTodo, Todo } from "../../../../todo/model/todo/Todo";

describe("Todoの作成テスト", () => {
  test("TodoTextを渡すとIDにULIDをセットしてTodoオブジェクトを作成する", () => {
    const newText = "a new todo!";
    const todo: Todo = createTodo(newText);
    expect(todo.id).toMatch(/^[0-9A-Z]{26}$/);
    expect(todo.text).toBe(newText);
    expect(todo.isCompleted).toBeFalsy();
    expect(todo.color).toBeUndefined();
  });

  test("IDは重複しないこと", () => {
    const todo1 = createTodo("This is a first Todo!");
    const todo2 = createTodo("This is a second Todo!");
    expect(todo1.id).not.toBe(todo2.id);
  });
});
