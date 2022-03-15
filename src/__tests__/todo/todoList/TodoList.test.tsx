import { render, screen } from "@testing-library/react";
import TodoList from "../../../todo/todoList/TodoList";
import { Todo } from "../../../todo/model/todo/Todo";
import userEvent from "@testing-library/user-event";
import { TODO_COLOR, TodoColor } from "../../../todo/model/filter/TodoColors";

const onChangeCompleteHandler: jest.Mock = jest.fn();
const onChangeColorHandler: jest.Mock = jest.fn();

describe("Todoの件数による表示テスト", () => {
  const expectTexts: string[] = [
    "これは１つ目のTodoです",
    "This is a text in the second row",
  ];
  test.each`
    text
    ${expectTexts[0]}
    ${expectTexts[1]}
  `("Todoが１件で $text を表示すること", ({ text }: { text: string }) => {
    const todos: Array<Todo> = [
      {
        id: "dummy",
        text: text,
        isCompleted: false,
        color: TODO_COLOR.None,
      },
    ];
    render(
      <TodoList
        todos={todos}
        onChangeCompleteHandler={onChangeCompleteHandler}
        onChangeColorHandler={onChangeColorHandler}
      />
    );
    const todoTexts = screen.getAllByLabelText("content-todo");
    expect(todoTexts).toHaveLength(1);
    expect(todoTexts[0].textContent).toBe(text);
  });

  test("Todoが2件の場合の表示", () => {
    const todos: Array<Todo> = [
      {
        id: "dummy-1",
        text: expectTexts[0],
        isCompleted: false,
        color: TODO_COLOR.None,
      },
      {
        id: "dummy-2",
        text: expectTexts[1],
        isCompleted: false,
        color: TODO_COLOR.None,
      },
    ];
    render(
      <TodoList
        todos={todos}
        onChangeCompleteHandler={onChangeCompleteHandler}
        onChangeColorHandler={onChangeColorHandler}
      />
    );
    const todoTexts = screen.getAllByLabelText("content-todo");
    expect(todoTexts).toHaveLength(2);
    todoTexts.forEach((todoText, index) => {
      expect(todoText.textContent).toBe(expectTexts[index]);
    });
  });

  test("Todoが0件ならリストは表示されない", () => {
    render(
      <TodoList
        todos={[]}
        onChangeCompleteHandler={onChangeCompleteHandler}
        onChangeColorHandler={onChangeColorHandler}
      />
    );
    const todoTexts = screen.queryAllByLabelText("content-todo");
    expect(todoTexts).toHaveLength(0);
  });
});

describe("Todoの状況を更新する", () => {
  test.each`
    isCompleted
    ${false}
    ${true}
  `(
    "完了状況が $isCompleted のTodoをクリックすると onChangeCompleteHandler関数を呼ぶこと",
    async ({ isCompleted }: { isCompleted: boolean }) => {
      // Given: Todoを１つ用意して表示する
      const id: string = "dummy-id";
      const todos: Todo[] = [
        {
          id,
          text: "完了チェックのテスト",
          isCompleted,
          color: TODO_COLOR.None,
        },
      ];
      render(
        <TodoList
          todos={todos}
          onChangeCompleteHandler={onChangeCompleteHandler}
          onChangeColorHandler={onChangeColorHandler}
        />
      );
      const user = userEvent.setup();
      const checkBox = screen.getAllByRole("checkbox", {
        name: "todo-isCompleted",
      })[0];

      // When:Todoの完了状況を更新する
      await user.click(checkBox);

      // Then: Todoの完了状況が更新されること
      expect(onChangeCompleteHandler).toHaveBeenCalledTimes(1);
      expect(onChangeCompleteHandler.mock.calls[0][0]).toBe(id);
    }
  );
  test.each`
    changingColor
    ${TODO_COLOR.None}
    ${TODO_COLOR.Blue}
    ${TODO_COLOR.Green}
    ${TODO_COLOR.Orange}
    ${TODO_COLOR.Purple}
    ${TODO_COLOR.Red}
  `(
    "Colorタグを $changingColor に変更したら onChangeColorHandler関数を呼ぶこと",
    async ({ changingColor }: { changingColor: TodoColor }) => {
      // Given: TodoListコンポーネントをレンダリングする
      const id: string = "dummy-id";
      const todos: Todo[] = [
        {
          id,
          text: "Colorタグの変更",
          isCompleted: false,
          color: TODO_COLOR.None,
        },
      ];
      render(
        <TodoList
          todos={todos}
          onChangeCompleteHandler={onChangeCompleteHandler}
          onChangeColorHandler={onChangeColorHandler}
        />
      );
      const user = userEvent.setup();
      const selectBox = screen.getByLabelText("select-todo-color");

      // When: Colorタグを変更する
      await user.selectOptions(selectBox, changingColor);

      // Then: TodoのIDと変更するColorを渡して関数を1回呼び出すこと
      expect(onChangeColorHandler).toHaveBeenCalledTimes(1);
      expect(onChangeColorHandler.mock.calls[0]).toEqual([id, changingColor]);
    }
  );
});
