import { TodoListPage } from "../pageObjects/todo/TodoListPage";

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
        const page = await TodoListPage.build(0);

        // When: TextBoxにTodoを入力してEnterキーを押す
        await page.inputNewTodo(todoContent);

        // Then: 入力したTodoがリストに表示されること
        expect(await page.numOfTodos()).toBe(1);
        expect(await page.isCompletedTodoByRow(1)).toBe(false);
        expect(await page.getContentTodoByRow(1)).toBe(todoContent);
        expect(await page.getColorOfTodoByRow(1)).toBe("");
      }
    );
  });
  describe("TodoリストにTodoがある状態で新しいTodoを追加する", () => {
    test("新しいTodoはリストの最後に追加されること", async () => {
      // Given: Todoを１つ作成しておく
      const page = await TodoListPage.build(1);

      // When: ２つ目のTodoを作成する
      await page.inputNewTodo("A second Todo");

      // Then: 追加したTodoが２番目に表示されること
      expect(await page.numOfTodos()).toBe(2);
      expect(await page.isCompletedTodoByRow(2)).toBe(false);
      expect(await page.getContentTodoByRow(2)).toBe("A second Todo");
      expect(await page.getColorOfTodoByRow(2)).toBe("");
    });
  });
});

describe("Todoの操作", () => {
  describe("Todoの完了が操作できること", () => {
    test("未完了のTodoを完了にできること", async () => {
      // Given: TodoアプリをレンダリングしてTodoを２つ作成する
      const page = await TodoListPage.build(2);

      // When: ２番目のTodoを完了にする
      await page.clickCompleteTodoByRow(2);

      // Then: ２番目だけ完了になっていること
      expect(await page.isCompletedTodoByRow(1)).toBe(false);
      expect(await page.isCompletedTodoByRow(2)).toBe(true);
    });

    test("完了済みにしたTodoを未完了に戻せること", async () => {
      // Given: TodoアプリをレンダリングしてTodoを２つ作成する
      const page = await TodoListPage.build(2);

      // When: 2番目のTodoの完了状況を2回更新する
      await page.clickCompleteTodoByRow(2);
      expect(await page.isCompletedTodoByRow(2)).toBe(true);
      await page.clickCompleteTodoByRow(2);

      // Then: ２番目が未完了に戻っていること
      expect(await page.isCompletedTodoByRow(2)).toBe(false);
    });
  });
});
