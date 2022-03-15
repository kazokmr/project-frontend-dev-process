import { TodoListPage } from "../pageObjects/todo/TodoListPage";
import { TODO_COLOR, TodoColor } from "../../todo/model/filter/TodoColors";

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

  describe("TodoのColorタグが操作できること", () => {
    test.each`
      changingColor
      ${TODO_COLOR.None}
      ${TODO_COLOR.Blue}
      ${TODO_COLOR.Green}
      ${TODO_COLOR.Orange}
      ${TODO_COLOR.Purple}
      ${TODO_COLOR.Red}
    `(
      "TodoのColorタグを 未選択 から $changingColor に変更できる",
      async ({ changingColor }: { changingColor: TodoColor }) => {
        // Given: TodoアプリをレンダリングしてTodoを２つ作成する
        const page = await TodoListPage.build(2);

        // When:１番目のTodoのタグを変更する
        await page.selectColorLabelByRow(1, changingColor);

        // Then: １番目のColorタグが指定した色に変わっていること
        expect(await page.getColorOfTodoByRow(1)).toBe(changingColor);
        // 2番目のタグは変わらないこと
        expect(await page.getColorOfTodoByRow(2)).toBe(TODO_COLOR.None);
      }
    );

    test("選択したTodoのタグだけが変わること", async () => {
      // Given: TodoアプリをレンダリングしてTodoを3つ作成する
      const page = await TodoListPage.build(3);

      // When: ２つ目のTodoのタグだけ更新する
      await page.selectColorLabelByRow(2, TODO_COLOR.Red);

      // Then: ２番目のタグだけ変わり他のタグは変わらないこと
      expect(await page.getColorOfTodoByRow(1)).toBe(TODO_COLOR.None);
      expect(await page.getColorOfTodoByRow(2)).toBe(TODO_COLOR.Red);
      expect(await page.getColorOfTodoByRow(3)).toBe(TODO_COLOR.None);
    });

    test.each`
      beforeColor         | afterColor
      ${TODO_COLOR.Green} | ${TODO_COLOR.None}
      ${TODO_COLOR.Green} | ${TODO_COLOR.Blue}
      ${TODO_COLOR.Green} | ${TODO_COLOR.Green}
      ${TODO_COLOR.Green} | ${TODO_COLOR.Orange}
      ${TODO_COLOR.Green} | ${TODO_COLOR.Purple}
      ${TODO_COLOR.Green} | ${TODO_COLOR.Red}
    `(
      "TodoのColorタグを一度 $beforeColor にした後に $afterColor に変更できること",
      async ({
        beforeColor,
        afterColor,
      }: {
        beforeColor: TodoColor;
        afterColor: TodoColor;
      }) => {
        // Given: TodoアプリをレンダリングしてTodoを1つ作成する
        const page = await TodoListPage.build(1);
        // Todoのタグを一度変更しておく
        await page.selectColorLabelByRow(1, beforeColor);

        // When:Todoのタグを変更する
        await page.selectColorLabelByRow(1, afterColor);

        // Then: Todoのタグが最後に更新したタグに変わっていること
        expect(await page.getColorOfTodoByRow(1)).toBe(afterColor);
      }
    );
  });
});
