import { TodoListPage } from "../__tests__/pageObjects/todo/TodoListPage";
import { Todo } from "./model/todo/Todo";
import { TODO_COLOR, TodoColor } from "./model/filter/TodoColors";
import { TODO_STATUS, TodoStatus } from "./model/filter/TodoStatus";

describe("TodoリストにTodoを追加するテスト", () => {
  test.each`
    todoContent
    ${"This is a new Todo!"}
    ${"これは新しいTodoです！！"}
  `("空のTodoリストに「$todoContent」が追加できること", async ({ todoContent }: { todoContent: string }) => {
    // Given: コンポーネントを出力する
    const page = await TodoListPage.printWithRandomTodos(0);

    // When: Todoを書く
    await page.writeTodo(todoContent);

    // Then: Todoがリストに追加される
    expect(await TodoListPage.countTodos()).toBe(1);
    expect(await TodoListPage.isCompletedTodoByRow(1)).toBe(false);
    expect(await TodoListPage.getContentTodoByRow(1)).toBe(todoContent);
    expect(await TodoListPage.getColorOfTodoByRow(1)).toBe("");
  });

  test("既存のTodoリストの最後に追加されること", async () => {
    // Given: コンポーネントを出力しTodoを１つ追加する
    const page = await TodoListPage.printWithRandomTodos(1);

    // When: Todoを書く
    await page.writeTodo("A second Todo");

    // Then: Todoリストの最後に追加する
    expect(await TodoListPage.countTodos()).toBe(2);
    expect(await TodoListPage.isCompletedTodoByRow(2)).toBe(false);
    expect(await TodoListPage.getContentTodoByRow(2)).toBe("A second Todo");
    expect(await TodoListPage.getColorOfTodoByRow(2)).toBe("");
  });
});

describe("Todoリストの操作テスト", () => {
  describe("Todoの完了操作テスト", () => {
    test("未完了のTodoを完了にできること", async () => {
      // Given: コンポーネントを出力しTodoを２つ追加する
      const page = await TodoListPage.printByTodos([
        {
          id: "1",
          text: "test1",
          isCompleted: false,
          color: TODO_COLOR.None,
        },
        {
          id: "2",
          text: "test2",
          isCompleted: false,
          color: TODO_COLOR.None,
        },
      ]);

      // When: ２番目のTodoを完了にする
      await page.completeTodo(2);

      // Then: ２番目だけが完了になっていること
      expect(await TodoListPage.isCompletedTodoByRow(1)).toBe(false);
      expect(await TodoListPage.isCompletedTodoByRow(2)).toBe(true);
    });

    test("完了済みのTodoを未完了に戻せること", async () => {
      // Given: コンポーネントを出力しTodoを２つ追加する
      const page = await TodoListPage.printByTodos([
        {
          id: "1",
          text: "test1",
          isCompleted: false,
          color: TODO_COLOR.None,
        },
        {
          id: "2",
          text: "test2",
          isCompleted: true,
          color: TODO_COLOR.None,
        },
      ]);

      // When: ２番目のTodoの完了操作を行う
      await page.completeTodo(2);

      // Then: ２番目が未完了に戻る
      expect(await TodoListPage.isCompletedTodoByRow(2)).toBe(false);
    });
  });

  describe("TodoのColorタグの操作テスト", () => {
    test("選択したTodoのタグだけが変わること", async () => {
      // Given: コンポーネントを出力しTodoを３つ追加する
      const page = await TodoListPage.printByTodos([
        {
          id: "1",
          text: "test1",
          isCompleted: false,
          color: TODO_COLOR.None,
        },
        {
          id: "2",
          text: "test2",
          isCompleted: false,
          color: TODO_COLOR.None,
        },
        {
          id: "3",
          text: "test3",
          isCompleted: false,
          color: TODO_COLOR.None,
        },
      ]);

      // When: ２つ目のTodoのタグを更新する
      await page.changeColor(2, TODO_COLOR.Red);

      // Then: ２番目のTodoのタグが変わり他のTodoのタグは変わらないこと
      expect(await TodoListPage.getColorOfTodoByRow(1)).toBe(TODO_COLOR.None);
      expect(await TodoListPage.getColorOfTodoByRow(2)).toBe(TODO_COLOR.Red);
      expect(await TodoListPage.getColorOfTodoByRow(3)).toBe(TODO_COLOR.None);
    });

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
        const page = await TodoListPage.printWithRandomTodos(1);

        // When:TodoのColorタグを変更する
        await page.changeColor(1, changingColor);

        // Then: Colorタグが指定した色に変わる
        expect(await TodoListPage.getColorOfTodoByRow(1)).toBe(changingColor);
      },
    );

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
      async ({ beforeColor, afterColor }: { beforeColor: TodoColor; afterColor: TodoColor }) => {
        // Given: コンポーネントを出力しTodoを１つ追加する
        const page = await TodoListPage.printByTodos([
          {
            id: "1",
            text: "test1",
            isCompleted: false,
            color: beforeColor,
          },
        ]);

        // When:Todoのタグを変更する
        await page.changeColor(1, afterColor);

        // Then: Todoのタグが最後に更新したタグに変わる
        expect(await TodoListPage.getColorOfTodoByRow(1)).toBe(afterColor);
      },
    );
  });

  describe("Todoの削除テスト", () => {
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
          const page = await TodoListPage.printByTodos(todos);

          // When: 指定列のTodoを削除する
          await page.deleteTodo(numOfDel);

          // Then: 削除していない２件のTodoが残り、削除したTodoより後のTodoが繰り上がる
          const firstIdx = willBeFirstRow - 1;
          const secondIdx = willBeSecondRow - 1;
          expect(await TodoListPage.countTodos()).toBe(2);
          expect(await TodoListPage.getContentTodoByRow(1)).toBe(todos[firstIdx].text);
          expect(await TodoListPage.isCompletedTodoByRow(1)).toBe(todos[firstIdx].isCompleted);
          expect(await TodoListPage.getColorOfTodoByRow(1)).toBe(todos[firstIdx].color);
          expect(await TodoListPage.getContentTodoByRow(2)).toBe(todos[secondIdx].text);
          expect(await TodoListPage.isCompletedTodoByRow(2)).toBe(todos[secondIdx].isCompleted);
          expect(await TodoListPage.getColorOfTodoByRow(2)).toBe(todos[secondIdx].color);
        },
      );
    });
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
        await TodoListPage.printWithDefaultTodos(numOfTodos);

        // Then: 未完了のTodo件数が表示される
        expect(await TodoListPage.isContentRemainingTodos(numOfTodos)).toBeTruthy();
      },
    );

    test.each`
      initialCount
      ${0}
      ${1}
      ${2}
    `(
      "Todoを追加するとRemaining Todos が$initialCountから１件増えること",
      async ({ initialCount }: { initialCount: number }) => {
        // Given: コンポーネントを出力しTodoを追加する
        const page: TodoListPage = await TodoListPage.printWithDefaultTodos(initialCount);

        // When: Todoを追加する
        await page.writeTodo("Remaining Todos が１件増えることを確認する");

        // Then: 未完了のTodo件数が表示される
        const countAfter = initialCount + 1;
        expect(await TodoListPage.countTodos()).toBe(countAfter);
        expect(await TodoListPage.isContentRemainingTodos(countAfter)).toBeTruthy();
      },
    );

    test.each`
      initialCount
      ${3}
      ${2}
      ${1}
    `(
      "未完了のTodoを削除するとRemaining Todos が$initialCountから１件減ること",
      async ({ initialCount }: { initialCount: number }) => {
        // Given: コンポーネントを出力しTodoを追加する
        const page: TodoListPage = await TodoListPage.printWithDefaultTodos(initialCount);

        // When: １番目のTodoを削除する
        await page.deleteTodo(1);

        // Then: 未完了のTodo件数が表示される
        const countAfter = initialCount - 1;
        expect(await TodoListPage.countTodos()).toBe(countAfter);
        expect(await TodoListPage.isContentRemainingTodos(countAfter)).toBeTruthy();
      },
    );

    describe("完了したTodoはRemaining Todosの表示件数に含まれない", () => {
      test("Todoを完了するとRemaining Todosの表示件数から除かれること", async () => {
        // Given: コンポーネントを出力しTodoを追加する
        const initialCount = 3;
        const page: TodoListPage = await TodoListPage.printWithDefaultTodos(initialCount);

        // When: １番目のTodoを完了済みにする
        await page.completeTodo(1);

        // Then: Remaining Todoの表示件数はTodoリストの件数から１件少なくなる
        expect(await TodoListPage.countTodos()).toBe(initialCount);
        expect(await TodoListPage.isContentRemainingTodos(initialCount - 1)).toBeTruthy();
      });

      test("Todoを未完了に戻すとRemaining Todosの表示件数に含まれること", async () => {
        // Given: コンポーネントを出力しTodoを３件（内２件が完了済み）を表示する
        const initCount = 3;
        const page: TodoListPage = await TodoListPage.printByTodos([
          {
            id: "1",
            text: "test1",
            isCompleted: true,
            color: TODO_COLOR.None,
          },
          {
            id: "2",
            text: "test2",
            isCompleted: true,
            color: TODO_COLOR.None,
          },
          {
            id: "3",
            text: "test3",
            isCompleted: false,
            color: TODO_COLOR.None,
          },
        ]);
        expect(await TodoListPage.isContentRemainingTodos(initCount - 2)).toBeTruthy();

        // When: １番目のTodoを未完了に戻す
        await page.completeTodo(1);

        // Then: Remaining Todoの表示件数は１件増えること
        expect(await TodoListPage.countTodos()).toBe(initCount);
        expect(await TodoListPage.isContentRemainingTodos(initCount - 1)).toBeTruthy();
      });
    });
  });

  describe("StatusフィルタによるTodoリストの表示テスト", () => {
    const todos: Todo[] = [
      {
        id: "1",
        text: "これは完了済みのTodo１です",
        isCompleted: true,
        color: TODO_COLOR.None,
      },
      {
        id: "2",
        text: "これは未完了のTodo２です",
        isCompleted: false,
        color: TODO_COLOR.None,
      },
      {
        id: "3",
        text: "これは完了済みのTodo３です",
        isCompleted: true,
        color: TODO_COLOR.None,
      },
      {
        id: "4",
        text: "これは未完了のTodo４です",
        isCompleted: false,
        color: TODO_COLOR.None,
      },
    ];

    test.each`
      clickedStatus            | isAllPressed | isActivePressed | isCompletedPressed
      ${TODO_STATUS.ALL}       | ${true}      | ${false}        | ${false}
      ${TODO_STATUS.ACTIVE}    | ${false}     | ${true}         | ${false}
      ${TODO_STATUS.COMPLETED} | ${false}     | ${false}        | ${true}
    `(
      "$clickedStatusが選択状況になっていること",
      async ({
        clickedStatus,
        isAllPressed,
        isActivePressed,
        isCompletedPressed,
      }: {
        clickedStatus: TodoStatus;
        isAllPressed: boolean;
        isActivePressed: boolean;
        isCompletedPressed: boolean;
      }) => {
        // Given: コンポーネントを表示する
        const page = await TodoListPage.printWithDefaultTodos(0);

        // When: ボタンを押す
        await page.extractTodosByStatus(clickedStatus);

        // Then: 選択したフィルタに対応するボタンだけが押された状態となること
        expect(await TodoListPage.isSelectedStatus(TODO_STATUS.ALL)).toBe(isAllPressed);
        expect(await TodoListPage.isSelectedStatus(TODO_STATUS.ACTIVE)).toBe(isActivePressed);
        expect(await TodoListPage.isSelectedStatus(TODO_STATUS.COMPLETED)).toBe(isCompletedPressed);
      },
    );

    test("Allボタンを押したら全てのTodoがリストに表示されること", async () => {
      // Given: コンポーネントを出力しTodoを４件（内２件が完了済み）を表示する
      const page = await TodoListPage.printByTodos(todos);

      // When: 全てのTodoを表示するように切り替える
      await page.extractTodosByStatus(TODO_STATUS.ALL);

      // Then: 未完了も完了済みも全てのTodoを表示する
      expect(await TodoListPage.countTodos()).toBe(4);
      expect(await TodoListPage.isCompletedTodoByRow(1)).toBe(todos[0].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(1)).toBe(todos[0].text);
      expect(await TodoListPage.isCompletedTodoByRow(2)).toBe(todos[1].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(2)).toBe(todos[1].text);
      expect(await TodoListPage.isCompletedTodoByRow(3)).toBe(todos[2].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(3)).toBe(todos[2].text);
      expect(await TodoListPage.isCompletedTodoByRow(4)).toBe(todos[3].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(4)).toBe(todos[3].text);
    });

    test("Activeボタンを押したら未完了のTodoだけがリストに表示されること", async () => {
      // Given: コンポーネントを出力しTodoを４件（内２件が完了済み）を表示する
      const page = await TodoListPage.printByTodos(todos);

      // When: 未完了のTodoを抽出する
      await page.extractTodosByStatus(TODO_STATUS.ACTIVE);

      // Then: 未完了のTodoだけが表示される
      expect(await TodoListPage.countTodos()).toBe(2);
      expect(await TodoListPage.isCompletedTodoByRow(1)).toBe(todos[1].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(1)).toBe(todos[1].text);
      expect(await TodoListPage.isCompletedTodoByRow(2)).toBe(todos[3].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(2)).toBe(todos[3].text);
    });

    test("Completedボタンを押したら完了済みのTodoだけがリストに表示されること", async () => {
      // Given: コンポーネントを出力しTodoを４件（内２件が完了済み）を表示する
      const page = await TodoListPage.printByTodos(todos);

      // When: 完了済みのTodoを抽出する
      await page.extractTodosByStatus(TODO_STATUS.COMPLETED);

      // Then: 完了済みのTodoだけが表示される
      expect(await TodoListPage.countTodos()).toBe(2);
      expect(await TodoListPage.isCompletedTodoByRow(1)).toBe(todos[0].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(1)).toBe(todos[0].text);
      expect(await TodoListPage.isCompletedTodoByRow(2)).toBe(todos[2].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(2)).toBe(todos[2].text);
    });

    test("未完了のみを抽出した後に全てのTodoを抽出できること", async () => {
      // Given: コンポーネントを出力しTodoを４件（内２件が完了済み）を表示する
      const page = await TodoListPage.printByTodos(todos);
      // 未完了を抽出する
      await page.extractTodosByStatus(TODO_STATUS.ACTIVE);
      expect(await TodoListPage.countTodos()).toBe(2);

      // When: 全てのTodoを抽出する
      await page.extractTodosByStatus(TODO_STATUS.ALL);

      // Then: 未完了も完了済みも全てのTodoを表示する
      expect(await TodoListPage.countTodos()).toBe(4);
      expect(await TodoListPage.isCompletedTodoByRow(1)).toBe(todos[0].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(1)).toBe(todos[0].text);
      expect(await TodoListPage.isCompletedTodoByRow(2)).toBe(todos[1].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(2)).toBe(todos[1].text);
      expect(await TodoListPage.isCompletedTodoByRow(3)).toBe(todos[2].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(3)).toBe(todos[2].text);
      expect(await TodoListPage.isCompletedTodoByRow(4)).toBe(todos[3].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(4)).toBe(todos[3].text);
    });

    test("完了済みを抽出した後に全てのTodoを抽出できること", async () => {
      // Given: コンポーネントを出力しTodoを４件（内２件が完了済み）を表示する
      const page = await TodoListPage.printByTodos(todos);
      // 完了済みを抽出する
      await page.extractTodosByStatus(TODO_STATUS.COMPLETED);
      expect(await TodoListPage.countTodos()).toBe(2);

      // When: 全てのTodoを抽出する
      await page.extractTodosByStatus(TODO_STATUS.ALL);

      // Then: 未完了も完了済みも全てのTodoを表示する
      expect(await TodoListPage.countTodos()).toBe(4);
      expect(await TodoListPage.isCompletedTodoByRow(1)).toBe(todos[0].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(1)).toBe(todos[0].text);
      expect(await TodoListPage.isCompletedTodoByRow(2)).toBe(todos[1].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(2)).toBe(todos[1].text);
      expect(await TodoListPage.isCompletedTodoByRow(3)).toBe(todos[2].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(3)).toBe(todos[2].text);
      expect(await TodoListPage.isCompletedTodoByRow(4)).toBe(todos[3].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(4)).toBe(todos[3].text);
    });

    test("未完了のみを抽出した後に完了済みだけを抽出できること", async () => {
      // Given: コンポーネントを出力しTodoを４件（内２件が完了済み）を表示する
      const page = await TodoListPage.printByTodos(todos);
      // 未完了を抽出する
      await page.extractTodosByStatus(TODO_STATUS.ACTIVE);
      expect(await TodoListPage.isCompletedTodoByRow(1)).toBe(todos[1].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(1)).toBe(todos[1].text);
      expect(await TodoListPage.isCompletedTodoByRow(2)).toBe(todos[3].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(2)).toBe(todos[3].text);

      // When: 完了済みのTodoを抽出する
      await page.extractTodosByStatus(TODO_STATUS.COMPLETED);

      // Then: 完了済みのTodoだけを表示する
      expect(await TodoListPage.isCompletedTodoByRow(1)).toBe(todos[0].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(1)).toBe(todos[0].text);
      expect(await TodoListPage.isCompletedTodoByRow(2)).toBe(todos[2].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(2)).toBe(todos[2].text);
    });

    test("完了済みのみを抽出した後に未完了だけを抽出できること", async () => {
      // Given: コンポーネントを出力しTodoを４件（内２件が完了済み）を表示する
      const page = await TodoListPage.printByTodos(todos);
      // 完了済みを抽出する
      await page.extractTodosByStatus(TODO_STATUS.COMPLETED);
      expect(await TodoListPage.isCompletedTodoByRow(1)).toBe(todos[0].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(1)).toBe(todos[0].text);
      expect(await TodoListPage.isCompletedTodoByRow(2)).toBe(todos[2].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(2)).toBe(todos[2].text);

      // When: 未完了のTodoを抽出する
      await page.extractTodosByStatus(TODO_STATUS.ACTIVE);

      // Then: 未完了のTodoだけを表示する
      expect(await TodoListPage.isCompletedTodoByRow(1)).toBe(todos[1].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(1)).toBe(todos[1].text);
      expect(await TodoListPage.isCompletedTodoByRow(2)).toBe(todos[3].isCompleted);
      expect(await TodoListPage.getContentTodoByRow(2)).toBe(todos[3].text);
    });
  });

  describe("Colorフィルタで表示するTodoを抽出する", () => {
    const todos: Todo[] = [
      {
        id: "1",
        text: "色未選択のTodoです",
        isCompleted: true,
        color: TODO_COLOR.None,
      },
      {
        id: "2",
        text: "GreenタグのTodoです",
        isCompleted: false,
        color: TODO_COLOR.Green,
      },
      {
        id: "3",
        text: "OrangeタグのTodoです",
        isCompleted: false,
        color: TODO_COLOR.Orange,
      },
      {
        id: "4",
        text: "BlueタグのTodoです",
        isCompleted: true,
        color: TODO_COLOR.Blue,
      },
    ];

    test("Greenだけを選択したらColorタグがGreenのTodoだけを抽出する", async () => {
      // Given: コンポーネントを出力しTodoを４件を表示する
      const page = await TodoListPage.printByTodos(todos);

      // When: ColorフィルタからGreenを選択する
      await page.extractTodosByColors([TODO_COLOR.Green]);

      // Then: GreenのTodoだけを表示する
      expect(await TodoListPage.countTodos()).toBe(1);
      expect(await TodoListPage.getColorOfTodoByRow(1)).toBe(TODO_COLOR.Green);
      expect(await TodoListPage.getContentTodoByRow(1)).toBe(todos[1].text);
      expect(await TodoListPage.isCompletedTodoByRow(1)).toBe(todos[1].isCompleted);
    });

    test("GreenとOrangeのTodoだけを抽出する", async () => {
      // Given: コンポーネントを出力しTodoを４件を表示する
      const page = await TodoListPage.printByTodos(todos);

      // When: ColorフィルタからGreenとOrangeを選択する
      await page.extractTodosByColors([TODO_COLOR.Green, TODO_COLOR.Orange]);

      // Then: GreenとOrangeのTodoだけを表示する
      expect(await TodoListPage.countTodos()).toBe(2);
      expect(await TodoListPage.getColorOfTodoByRow(1)).toBe(TODO_COLOR.Green);
      expect(await TodoListPage.getContentTodoByRow(1)).toBe(todos[1].text);
      expect(await TodoListPage.isCompletedTodoByRow(1)).toBe(todos[1].isCompleted);
      expect(await TodoListPage.getColorOfTodoByRow(2)).toBe(TODO_COLOR.Orange);
      expect(await TodoListPage.getContentTodoByRow(2)).toBe(todos[2].text);
      expect(await TodoListPage.isCompletedTodoByRow(2)).toBe(todos[2].isCompleted);
    });

    test("Greenを選択した後にチェックを外したら全てのTodoを表示する", async () => {
      // Given: コンポーネントを出力しTodoを４件を表示する
      const page = await TodoListPage.printByTodos(todos);
      // GreenのTodoだけを抽出する
      await page.extractTodosByColors([TODO_COLOR.Green]);
      expect(await TodoListPage.countTodos()).toBe(1);
      expect(await TodoListPage.getColorOfTodoByRow(1)).toBe(TODO_COLOR.Green);

      // When: Greenのチェックを外す
      await page.unExtractTodosByColors([TODO_COLOR.Green]);

      // Then: 全てのTodoが表示される
      expect(await TodoListPage.countTodos()).toBe(4);
      expect(await TodoListPage.getColorOfTodoByRow(1)).toBe(todos[0].color);
      expect(await TodoListPage.getColorOfTodoByRow(2)).toBe(todos[1].color);
      expect(await TodoListPage.getColorOfTodoByRow(3)).toBe(todos[2].color);
      expect(await TodoListPage.getColorOfTodoByRow(4)).toBe(todos[3].color);
    });

    test("GreenとOrangeを選択した後にGreenだけ外したらOrangeのTodoだけを表示する", async () => {
      // Given: コンポーネントを出力しTodoを４件を表示する
      const page = await TodoListPage.printByTodos(todos);
      // ColorフィルタからGreenとOrangeを選択する
      await page.extractTodosByColors([TODO_COLOR.Green, TODO_COLOR.Orange]);
      expect(await TodoListPage.countTodos()).toBe(2);
      expect(await TodoListPage.getColorOfTodoByRow(1)).toBe(TODO_COLOR.Green);
      expect(await TodoListPage.getColorOfTodoByRow(2)).toBe(TODO_COLOR.Orange);

      // When: Greenだけチェックを外す
      await page.unExtractTodosByColors([TODO_COLOR.Green]);

      // Then: OrangeのTodoだけが表示される
      expect(await TodoListPage.countTodos()).toBe(1);
      expect(await TodoListPage.getColorOfTodoByRow(1)).toBe(TODO_COLOR.Orange);
      expect(await TodoListPage.getContentTodoByRow(1)).toBe(todos[2].text);
      expect(await TodoListPage.isCompletedTodoByRow(1)).toBe(todos[2].isCompleted);
    });
  });

  describe("フィルタの複合テスト", () => {
    const todos: Todo[] = [
      {
        id: "1",
        text: "色未選択の完了済みTodoです",
        isCompleted: true,
        color: TODO_COLOR.None,
      },
      {
        id: "2",
        text: "Greenタグの未完了Todoです",
        isCompleted: false,
        color: TODO_COLOR.Green,
      },
      {
        id: "3",
        text: "Orangeタグの未完了Todoです",
        isCompleted: false,
        color: TODO_COLOR.Orange,
      },
      {
        id: "4",
        text: "Blueタグの完了済みTodoです",
        isCompleted: true,
        color: TODO_COLOR.Blue,
      },
      {
        id: "5",
        text: "Orangeタグの完了済みTodoです",
        isCompleted: true,
        color: TODO_COLOR.Orange,
      },
      {
        id: "6",
        text: "Blueタグの未完了Todoです",
        isCompleted: false,
        color: TODO_COLOR.Blue,
      },
    ];

    test("完了済みのBlueのTodoだけを表示する", async () => {
      // Given: コンポーネントを出力しTodoを6件を表示する
      const page = await TodoListPage.printByTodos(todos);
      expect(await TodoListPage.countTodos()).toBe(6);

      // When: Statusフィルタを完了済みにし、ColorフィルタからBlueとGreenを選択する
      await page.extractTodosByStatus(TODO_STATUS.COMPLETED);
      await page.extractTodosByColors([TODO_COLOR.Blue, TODO_COLOR.Green]);

      // Then: Blueタグの完了済みTodoだけが抽出される
      expect(await TodoListPage.countTodos()).toBe(1);
      expect(await TodoListPage.getContentTodoByRow(1)).toBe(todos[3].text);
      expect(await TodoListPage.isCompletedTodoByRow(1)).toBe(todos[3].isCompleted);
      expect(await TodoListPage.getColorOfTodoByRow(1)).toBe(todos[3].color);
    });

    test("未完了のOrangeのTodoだけを表示する", async () => {
      // Given: コンポーネントを出力しTodoを6件を表示する
      const page = await TodoListPage.printByTodos(todos);
      expect(await TodoListPage.countTodos()).toBe(6);

      // When: ColorフィルタからOrangeを選択し、Statusフィルタを未完了にする
      await page.extractTodosByColors([TODO_COLOR.Orange]);
      await page.extractTodosByStatus(TODO_STATUS.ACTIVE);

      // Then: Orangeタグの未完了Todoだけが抽出される
      expect(await TodoListPage.countTodos()).toBe(1);
      expect(await TodoListPage.getContentTodoByRow(1)).toBe(todos[2].text);
      expect(await TodoListPage.isCompletedTodoByRow(1)).toBe(todos[2].isCompleted);
      expect(await TodoListPage.getColorOfTodoByRow(1)).toBe(todos[2].color);
    });
  });

  describe("Todoの一括操作のテスト", () => {
    const todos: Todo[] = [
      {
        id: "1",
        text: "色未選択の完了済みTodoです",
        isCompleted: false,
        color: TODO_COLOR.None,
      },
      {
        id: "2",
        text: "Greenタグの未完了Todoです",
        isCompleted: false,
        color: TODO_COLOR.Green,
      },
      {
        id: "3",
        text: "Orangeタグの未完了Todoです",
        isCompleted: false,
        color: TODO_COLOR.Orange,
      },
      {
        id: "4",
        text: "Blueタグの完了済みTodoです",
        isCompleted: true,
        color: TODO_COLOR.Blue,
      },
      {
        id: "5",
        text: "Orangeタグの完了済みTodoです",
        isCompleted: true,
        color: TODO_COLOR.Orange,
      },
    ];

    test("全てのTodoを完了済みにできること", async () => {
      // Given: コンポーネントを出力しTodoを５件表示する
      const page = await TodoListPage.printByTodos(todos);
      expect(await TodoListPage.countTodos()).toBe(5);

      // When: Mark All Completed を実施する
      await page.markAllCompleted();

      // Then: Todoが全て完了済みになり、未完了のTodoが０件となる
      expect(await TodoListPage.countTodos()).toBe(5);
      const promises: Promise<boolean>[] = [];
      for (let row = 1; row <= 5; row += 1) {
        promises.push(TodoListPage.isCompletedTodoByRow(row));
      }
      await Promise.all(promises).then((values) => values.forEach((isCompleted) => expect(isCompleted).toBeTruthy()));
      expect(await TodoListPage.isContentRemainingTodos(0)).toBeTruthy();
    });

    test("全ての完了済みのTodoをまとめたリストから削除できること", async () => {
      // Given: コンポーネントを出力しTodoを５件表示する
      const page = await TodoListPage.printByTodos(todos);
      expect(await TodoListPage.countTodos()).toBe(5);

      // When: Clear Completedを押す
      await page.clearCompleted();

      // Then: 未完了のTodoの３件だけがリストに残る
      expect(await TodoListPage.countTodos()).toBe(3);
      const promises: Promise<boolean>[] = [];
      for (let row = 1; row <= 3; row += 1) {
        promises.push(TodoListPage.isCompletedTodoByRow(row));
      }
      await Promise.all(promises).then((values) => values.forEach((isCompleted) => expect(isCompleted).toBeFalsy()));
      expect(await TodoListPage.isContentRemainingTodos(3)).toBeTruthy();
    });
  });
});
