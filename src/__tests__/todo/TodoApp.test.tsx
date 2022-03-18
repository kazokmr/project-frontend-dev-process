import { TodoListPage } from "../pageObjects/todo/TodoListPage";
import { TODO_COLOR, TodoColor } from "../../todo/model/filter/TodoColors";
import { Todo } from "../../todo/model/todo/Todo";
import { cleanup } from "@testing-library/react";

describe("TodoリストにTodoを追加するテスト", () => {
  test.each`
    todoContent
    ${"This is a new Todo!"}
    ${"これは新しいTodoです！！"}
  `(
    "空のTodoリストに「$todoContent」が追加できること",
    async ({ todoContent }: { todoContent: string }) => {
      // Given: コンポーネントを出力する
      const page = await TodoListPage.print(0);
      expect(page.countTodos()).toBe(0);

      // When: Todoを書く
      await page.writeTodo(todoContent);

      // Then: Todoがリストに追加される
      expect(page.countTodos()).toBe(1);
      expect(page.isCompletedTodoByRow(1)).toBe(false);
      expect(page.getContentTodoByRow(1)).toBe(todoContent);
      expect(page.getColorOfTodoByRow(1)).toBe("");
    }
  );
  test("既存のTodoリストの最後に追加されること", async () => {
    // Given: コンポーネントを出力しTodoを１つ追加する
    const page = await TodoListPage.print(1);
    expect(page.countTodos()).toBe(1);

    // When: Todoを書く
    await page.writeTodo("A second Todo");

    // Then: Todoリストの最後に追加する
    expect(page.countTodos()).toBe(2);
    expect(page.isCompletedTodoByRow(2)).toBe(false);
    expect(page.getContentTodoByRow(2)).toBe("A second Todo");
    expect(page.getColorOfTodoByRow(2)).toBe("");
  });
});

describe("Todoリストの操作テスト", () => {
  describe("Todoの完了操作テスト", () => {
    test("未完了のTodoを完了にできること", async () => {
      // Given: コンポーネントを出力しTodoを２つ追加する
      const page = await TodoListPage.print(2);
      expect(page.countTodos()).toBe(2);

      // When: ２番目のTodoを完了にする
      await page.completeTodo(2);

      // Then: ２番目だけが完了になっていること
      expect(page.isCompletedTodoByRow(1)).toBe(false);
      expect(page.isCompletedTodoByRow(2)).toBe(true);
    });

    test("完了済みのTodoを未完了に戻せること", async () => {
      // Given: コンポーネントを出力しTodoを２つ追加する
      const page = await TodoListPage.print(2);
      expect(page.countTodos()).toBe(2);
      // ２番目のTodoを完了にする
      await page.completeTodo(2);
      expect(page.isCompletedTodoByRow(2)).toBe(true);

      // When: ２番目のTodoの完了操作を行う
      await page.completeTodo(2);

      // Then: ２番目が未完了に戻る
      expect(page.isCompletedTodoByRow(2)).toBe(false);
    });
  });

  describe("TodoのColorタグの操作テスト", () => {
    test.each`
      changingColor
      ${TODO_COLOR.None}
      ${TODO_COLOR.Blue}
      ${TODO_COLOR.Green}
      ${TODO_COLOR.Orange}
      ${TODO_COLOR.Purple}
      ${TODO_COLOR.Red}
    `(
      "TodoのColorタグを未選択から$changingColorに変更できる",
      async ({ changingColor }: { changingColor: TodoColor }) => {
        // Given: コンポーネントを出力しTodoを１つ追加する
        const page = await TodoListPage.print(1);
        expect(page.countTodos()).toBe(1);

        // When:TodoのColorタグを変更する
        await page.changeColor(1, changingColor);

        // Then: Colorタグが指定した色に変わる
        expect(page.getColorOfTodoByRow(1)).toBe(changingColor);
      }
    );

    test("選択したTodoのタグだけが変わること", async () => {
      // Given: コンポーネントを出力しTodoを３つ追加する
      const page = await TodoListPage.print(3);
      expect(page.countTodos()).toBe(3);

      // When: ２つ目のTodoのタグを更新する
      await page.changeColor(2, TODO_COLOR.Red);

      // Then: ２番目のTodoのタグが変わり他のTodoのタグは変わらないこと
      expect(page.getColorOfTodoByRow(1)).toBe(TODO_COLOR.None);
      expect(page.getColorOfTodoByRow(2)).toBe(TODO_COLOR.Red);
      expect(page.getColorOfTodoByRow(3)).toBe(TODO_COLOR.None);
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
      "TodoのColorタグを$beforeColorから$afterColorに変更できること",
      async ({
        beforeColor,
        afterColor,
      }: {
        beforeColor: TodoColor;
        afterColor: TodoColor;
      }) => {
        // Given: コンポーネントを出力しTodoを１つ追加する
        const page = await TodoListPage.print(1);
        expect(page.countTodos()).toBe(1);
        // Todoのタグを変更する
        await page.changeColor(1, beforeColor);

        // When:Todoのタグを再度変更する
        await page.changeColor(1, afterColor);

        // Then: Todoのタグが最後に更新したタグに変わる
        expect(page.getColorOfTodoByRow(1)).toBe(afterColor);
      }
    );
  });
  describe("Todoの削除テスト", () => {
    test("Todoがリストから削除されること", async () => {
      // Given: コンポーネントを出力しTodoを１つ追加する
      const page = await TodoListPage.print(1);
      expect(page.countTodos()).toBe(1);

      // When: Todoを削除する
      await page.deleteTodo(1);

      // Then: Todoリストの件数が０件になる
      expect(page.countTodos()).toBe(0);
    });
  });
  describe("指定した行のTodoが削除できること", () => {
    const todos: Todo[] = [
      {
        id: "test-1",
        text: "１つ目のTodoです",
        isCompleted: false,
        color: TODO_COLOR.Green,
      },
      {
        id: "test-2",
        text: "２つ目のTodoです",
        isCompleted: true,
        color: TODO_COLOR.None,
      },
      {
        id: "test-3",
        text: "３つ目のTodoです",
        isCompleted: false,
        color: TODO_COLOR.Blue,
      },
    ];
    let page: TodoListPage;
    beforeEach(async () => {
      // コンポーネントを出力しTodoを３つ用意し初期状態に更新する
      page = await TodoListPage.print();
      await page.writeTodo(todos[0].text);
      await page.writeTodo(todos[1].text);
      await page.writeTodo(todos[2].text);
      await page.changeColor(1, todos[0].color);
      await page.completeTodo(2);
      await page.changeColor(2, todos[1].color);
      await page.changeColor(3, todos[2].color);
    });

    afterEach(() => {
      cleanup();
    });

    test.each`
      numOfDel | willBeFirstRow | willBeSecondRow
      ${1}     | ${2}           | ${3}
      ${2}     | ${1}           | ${3}
      ${3}     | ${1}           | ${2}
    `(
      "$numOfDel列目を削除したら、$willBeFirstRow列目が1列目、 $willBeSecondRow列目が２列目になること",
      async ({
        numOfDel,
        willBeFirstRow,
        willBeSecondRow,
      }: {
        numOfDel: number;
        willBeFirstRow: number;
        willBeSecondRow: number;
      }) => {
        // Given: Todoが３件表示されている
        expect(page.countTodos()).toBe(3);

        // When: 指定列のTodoを削除する
        await page.deleteTodo(numOfDel);

        // Then: 削除していない２件のTodoが残り、削除したTodoより後のTodoが繰り上がる
        const firstIdx = willBeFirstRow - 1;
        const secondIdx = willBeSecondRow - 1;
        expect(page.countTodos()).toBe(2);
        expect(page.getContentTodoByRow(1)).toBe(todos[firstIdx].text);
        expect(page.isCompletedTodoByRow(1)).toBe(todos[firstIdx].isCompleted);
        expect(page.getColorOfTodoByRow(1)).toBe(todos[firstIdx].color);
        expect(page.getContentTodoByRow(2)).toBe(todos[secondIdx].text);
        expect(page.isCompletedTodoByRow(2)).toBe(todos[secondIdx].isCompleted);
        expect(page.getColorOfTodoByRow(2)).toBe(todos[secondIdx].color);
      }
    );
  });
  describe("Todoの未完了件数の表示テスト", () => {
    test.each`
      numOfTodos
      ${1}
      ${2}
      ${0}
    `(
      "全てのTodoが未完了の場合、$numOfTodos item(s) remain と表示すること",
      async ({ numOfTodos }: { numOfTodos: number }) => {
        // When: コンポーネントを出力しTodoを追加する
        const page: TodoListPage = await TodoListPage.print(numOfTodos);

        // Then: 未完了のTodo件数が表示される
        expect(page.countTodos()).toBe(numOfTodos);
        expect(await page.isContentRemainingTodos(numOfTodos)).toBeTruthy();
      }
    );
  });
});
