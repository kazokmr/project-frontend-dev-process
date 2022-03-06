import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoApp from "../../todo/TodoApp";
import { UserEvent } from "@testing-library/user-event/dist/types/setup";

describe("新しいTodo追加したらTodoリストに表示される", () => {
  describe("TextBox上でエンターキーを押す", () => {
    test.each`
      todoContent
      ${"This is a new Todo!"}
      ${"これは新しいTodoです！！"}
    `(
      "入力され $todoContent がTodoリストに表示されること",
      async ({ todoContent }: { todoContent: string }) => {
        // Given: コンポーネントをレンダリングする
        render(<TodoApp />);
        const user = userEvent.setup();
        const todoTextBox = screen.getByRole("textbox", { name: "input-todo" });

        // When: TextBoxにTodoを入力してEnterキーを押す
        await user.click(todoTextBox);
        await user.keyboard(todoContent);
        await user.keyboard("[Enter]");

        // Then: 入力したTodoがリストに表示されること
        const checkBoxes = await screen.findAllByRole("checkbox", {
          name: "todo-isCompleted",
        });
        const todoTexts = await screen.findAllByLabelText("content-todo");
        const colorListBoxes = await screen.findAllByRole("combobox", {
          name: "select-todo-color",
        });
        const deleteButtons = await screen.findAllByRole("button", {
          name: "delete-todo",
        });

        // checkBoxはActive状態で表示する
        expect(checkBoxes[0]).toBeInTheDocument();
        expect(checkBoxes[0]).not.toBeChecked();
        // 入力したTodoを表示する
        expect(todoTexts[0].textContent).toBe(todoContent);
        // Color選択ボックスは未選択状態で表示する
        expect(colorListBoxes[0]).toBeInTheDocument();
        expect(colorListBoxes[0]).toHaveValue("");
        // 削除ボタンを表示する
        expect(deleteButtons[0]).toBeInTheDocument();
      }
    );
  });
  describe("TodoリストにTodoがある状態で新しいTodoを追加する", () => {
    test("新しいTodoはリストの最後に追加されること", async () => {
      // Given: Todoを１つ作成しておく
      render(<TodoApp />);
      const user = userEvent.setup();
      const todoTextBox = screen.getByRole("textbox", { name: "input-todo" });

      await user.click(todoTextBox);
      await user.keyboard("A first Todo");
      await user.keyboard("[Enter]");

      // When: ２つ目のTodoを作成する
      await user.click(todoTextBox);
      await user.keyboard("A second Todo");
      await user.keyboard("[Enter]");

      const checkBoxes = await screen.findAllByRole("checkbox", {
        name: "todo-isCompleted",
      });
      const todoTexts = await screen.findAllByLabelText("content-todo");
      const colorListBoxes = await screen.findAllByRole("combobox", {
        name: "select-todo-color",
      });
      const deleteButtons = await screen.findAllByRole("button", {
        name: "delete-todo",
      });

      expect(checkBoxes).toHaveLength(2);
      expect(checkBoxes[1]).toBeInTheDocument();
      expect(checkBoxes[1]).not.toBeChecked();
      expect(todoTexts).toHaveLength(2);
      expect(todoTexts[1].textContent).toBe("A second Todo");
      expect(colorListBoxes).toHaveLength(2);
      expect(colorListBoxes[1]).toBeInTheDocument();
      expect(colorListBoxes[1]).toHaveValue("");
      expect(deleteButtons).toHaveLength(2);
      expect(deleteButtons[1]).toBeInTheDocument();
    });
  });
});

describe("Todoの操作", () => {
  describe("Todoの完了が操作できること", () => {
    test("未完了のTodoを完了にできること", async () => {
      // Given: TodoアプリをレンダリングしてTodoを２つ作成する
      const page = await TodoListPage.build(2);

      // When: ２番目のTodoを完了にする
      await page.clickCompleteTodoByIndex(2);

      // Then: ２番目だけ完了になっていること
      expect(await page.findCompletedOfTodoByIndex(1)).not.toBeChecked();
      expect(await page.findCompletedOfTodoByIndex(2)).toBeChecked();
    });

    test("完了済みにしたTodoを未完了に戻せること", async () => {
      // Given: TodoアプリをレンダリングしてTodoを２つ作成する
      const page = await TodoListPage.build(2);

      // When: 2番目のTodoの完了状況を2回更新する
      await page.clickCompleteTodoByIndex(2);
      expect(await page.findCompletedOfTodoByIndex(2)).toBeChecked();
      await page.clickCompleteTodoByIndex(2);

      // Then: ２番目が未完了に戻っていること
      expect(await page.findCompletedOfTodoByIndex(2)).not.toBeChecked();
    });
  });
});

class TodoListPage {
  private readonly user: UserEvent;
  private readonly todoTextBox: HTMLElement;

  private constructor() {
    render(<TodoApp />);
    this.user = userEvent.setup();
    this.todoTextBox = screen.getByRole("textbox", { name: "input-todo" });
  }

  // 初期Todoを設定するために非同期処理が必要だったので staticメソッドでインスタンスを生成するようにする
  static build = async (initNumberOfTodos: number): Promise<TodoListPage> => {
    const page = new TodoListPage();
    await page.setInitialTodo(initNumberOfTodos);
    return page;
  };

  private setInitialTodo = async (numberOfTodos: number) => {
    for (let number = 0; number < numberOfTodos; number++) {
      await this.inputNewTodo(`これは ${number + 1} のTodoです`);
    }
  };

  inputNewTodo = async (inputText: string): Promise<void> => {
    await this.user.click(this.todoTextBox);
    await this.user.keyboard(inputText);
    await this.user.keyboard("[Enter]");
  };

  findCompletedOfTodoByIndex = async (index: number): Promise<HTMLElement> => {
    const array: Array<HTMLElement> = await screen.findAllByRole("checkbox", {
      name: "todo-isCompleted",
    });
    return array[index - 1];
  };

  clickCompleteTodoByIndex = async (index: number): Promise<void> => {
    const checkComplete = await this.findCompletedOfTodoByIndex(index);
    await this.user.click(checkComplete);
  };
}
