import { TodoListPage } from "../pageObjects/todo/TodoListPage";
import { TODO_COLOR, TodoColor } from "../../todo/model/filter/TodoColors";
import { Todo } from "../../todo/model/todo/Todo";
import { cleanup } from "@testing-library/react";

describe("新しいTodo追加したらTodoリストに表示される", () => {
  describe("TextBox上でエンターキーを押す", () => {
    test.each`
      todoContent
      ${"This is a new Todo!"}
      ${"これは新しいTodoです！！"}
    `(
      "入力した $todoContent がTodoリストに表示されること",
      async ({ todoContent }: { todoContent: string }) => {
        // Given: コンポーネントをレンダリングする
        const page = await TodoListPage.build(0);

        // When: TextBoxにTodoを入力してEnterキーを押す
        await page.inputNewTodo(todoContent);

        // Then: 入力したTodoがリストに表示されること
        expect(page.numOfTodos()).toBe(1);
        expect(page.isCompletedTodoByRow(1)).toBe(false);
        expect(page.getContentTodoByRow(1)).toBe(todoContent);
        expect(page.getColorOfTodoByRow(1)).toBe("");
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
      expect(page.numOfTodos()).toBe(2);
      expect(page.isCompletedTodoByRow(2)).toBe(false);
      expect(page.getContentTodoByRow(2)).toBe("A second Todo");
      expect(page.getColorOfTodoByRow(2)).toBe("");
    });
  });
});

describe("Todoの操作", () => {
  describe("Todoの完了が操作できること", () => {
    test("未完了のTodoを完了にできること", async () => {
      // Given: TodoアプリをレンダリングしてTodoを２つ作成する
      const page = await TodoListPage.build(2);

      // When: ２番目のTodoを完了にする
      await page.completeTodoByRow(2);

      // Then: ２番目だけ完了になっていること
      expect(page.isCompletedTodoByRow(1)).toBe(false);
      expect(page.isCompletedTodoByRow(2)).toBe(true);
    });

    test("完了済みにしたTodoを未完了に戻せること", async () => {
      // Given: TodoアプリをレンダリングしてTodoを２つ作成する
      const page = await TodoListPage.build(2);

      // When: 2番目のTodoの完了状況を2回更新する
      await page.completeTodoByRow(2);
      expect(page.isCompletedTodoByRow(2)).toBe(true);
      await page.completeTodoByRow(2);

      // Then: ２番目が未完了に戻っていること
      expect(page.isCompletedTodoByRow(2)).toBe(false);
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
        await page.changeColorTagByRow(1, changingColor);

        // Then: １番目のColorタグが指定した色に変わっていること
        expect(page.getColorOfTodoByRow(1)).toBe(changingColor);
        // 2番目のタグは変わらないこと
        expect(page.getColorOfTodoByRow(2)).toBe(TODO_COLOR.None);
      }
    );

    test("選択したTodoのタグだけが変わること", async () => {
      // Given: TodoアプリをレンダリングしてTodoを3つ作成する
      const page = await TodoListPage.build(3);

      // When: ２つ目のTodoのタグだけ更新する
      await page.changeColorTagByRow(2, TODO_COLOR.Red);

      // Then: ２番目のタグだけ変わり他のタグは変わらないこと
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
        await page.changeColorTagByRow(1, beforeColor);

        // When:Todoのタグを変更する
        await page.changeColorTagByRow(1, afterColor);

        // Then: Todoのタグが最後に更新したタグに変わっていること
        expect(page.getColorOfTodoByRow(1)).toBe(afterColor);
      }
    );
  });
  describe("Todoが削除できる", () => {
    test("削除ボタンを押すとTodoがリストから削除されること", async () => {
      // Given: Todoアプリを表示してTodoを１つ作成する
      const page = await TodoListPage.build(1);
      // Todoリストが１件表示されていることを確認する
      expect(page.numOfTodos()).toBe(1);

      // When: 追加したTodoを削除する
      await page.deleteTodoByRow(1);

      // Then: Todoリストが０件になること
      expect(page.numOfTodos()).toBe(0);
    });
  });
  describe("指定した行のTodoが削除できる", () => {
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
      page = await TodoListPage.build();
      await page.inputNewTodo(todos[0].text);
      await page.inputNewTodo(todos[1].text);
      await page.inputNewTodo(todos[2].text);
      await page.changeColorTagByRow(1, todos[0].color);
      await page.completeTodoByRow(2);
      await page.changeColorTagByRow(2, todos[1].color);
      await page.changeColorTagByRow(3, todos[2].color);
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
      "$numOfDel 列目を削除したら、$willBeFirstRow 列目が1列目、 $willBeSecondRow 列目が２列目になること",
      async ({
        numOfDel,
        willBeFirstRow,
        willBeSecondRow,
      }: {
        numOfDel: number;
        willBeFirstRow: number;
        willBeSecondRow: number;
      }) => {
        // Given: Todoが３件表示されていることを確認
        expect(page.numOfTodos()).toBe(3);

        // When: Todoを削除する
        await page.deleteTodoByRow(numOfDel);

        // Then: Todoが２つになり、２番目が１番目、３番目が２番目に繰り上がること
        const firstIdx = willBeFirstRow - 1;
        const secondIdx = willBeSecondRow - 1;
        expect(page.numOfTodos()).toBe(2);
        expect(page.getContentTodoByRow(1)).toBe(todos[firstIdx].text);
        expect(page.isCompletedTodoByRow(1)).toBe(todos[firstIdx].isCompleted);
        expect(page.getColorOfTodoByRow(1)).toBe(todos[firstIdx].color);
        expect(page.getContentTodoByRow(2)).toBe(todos[secondIdx].text);
        expect(page.isCompletedTodoByRow(2)).toBe(todos[secondIdx].isCompleted);
        expect(page.getColorOfTodoByRow(2)).toBe(todos[secondIdx].color);
      }
    );
  });
});
