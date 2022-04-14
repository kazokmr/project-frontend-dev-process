import { render, screen } from "@testing-library/react";
import TodoList from "../../../todo/todoList/TodoList";
import { Todo } from "../../../todo/model/todo/Todo";
import userEvent from "@testing-library/user-event";
import { TODO_COLOR, TodoColor } from "../../../todo/model/filter/TodoColors";
import { QueryClient, QueryClientProvider } from "react-query";
import { TODO_STATUS, TodoStatus } from "../../../todo/model/filter/TodoStatus";

const mockedMutateTodoCompleted: jest.Mock = jest.fn();
const mockedMutateTodoChangedColor: jest.Mock = jest.fn();
const mockedMutateTodoDeleted: jest.Mock = jest.fn();
jest.mock("../../../todo/hooks/useTodos", () => ({
  useMutationTodoCompleted: () => ({ mutate: mockedMutateTodoCompleted }),
  useMutationTodoChangedColor: () => ({ mutate: mockedMutateTodoChangedColor }),
  useMutationTodoDeleted: () => ({ mutate: mockedMutateTodoDeleted }),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: Infinity } },
});

const status: TodoStatus = TODO_STATUS.ALL;
const colors: TodoColor[] = [];

beforeEach(() => {
  // テストごとにQueryClientを初期化する
  queryClient.clear();
  // 絞り込み条件をセットする
  queryClient.setQueryData<TodoStatus>(["status"], status);
  queryClient.setQueryData<TodoColor[]>(["colors"], colors);
});

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
    queryClient.setQueryData<Todo[]>(["todos", { status, colors }], todos);
    render(
      <QueryClientProvider client={queryClient}>
        <TodoList />
      </QueryClientProvider>
    );
    const todoTexts = screen.getAllByTestId("content-todo");
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
    queryClient.setQueryData<Todo[]>(["todos", { status, colors }], todos);
    render(
      <QueryClientProvider client={queryClient}>
        <TodoList />
      </QueryClientProvider>
    );
    const todoTexts = screen.getAllByTestId("content-todo");
    expect(todoTexts).toHaveLength(2);
    todoTexts.forEach((todoText, index) => {
      expect(todoText.textContent).toBe(expectTexts[index]);
    });
  });

  test("Todoが0件ならリストは表示されない", () => {
    queryClient.setQueryData<Todo[]>(["todos", { status, colors }], []);
    render(
      <QueryClientProvider client={queryClient}>
        <TodoList />
      </QueryClientProvider>
    );
    const todoTexts = screen.queryAllByLabelText("content-todo");
    expect(todoTexts).toHaveLength(0);
  });
});

describe("Todoの操作イベントの実行テスト", () => {
  describe("Todoの完了操作イベントの実行テスト", () => {
    test.each`
      isCompleted
      ${false}
      ${true}
    `(
      "完了状況が $isCompleted のTodoをクリックすると onChangeComplete関数を呼ぶこと",
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
        queryClient.setQueryData<Todo[]>(["todos", { status, colors }], todos);
        render(
          <QueryClientProvider client={queryClient}>
            <TodoList />
          </QueryClientProvider>
        );

        // When:Todoの完了状況を更新する
        const user = userEvent.setup();
        const checkBox = screen.getAllByRole("checkbox", {
          name: "todo-isCompleted",
        })[0];
        await user.click(checkBox);

        // Then: Todoの完了状況が更新されること
        expect(mockedMutateTodoCompleted.mock.calls[0][0]).toStrictEqual({
          id,
        });
        expect(mockedMutateTodoCompleted).toHaveBeenCalledTimes(1);
      }
    );
  });
  describe("TodoのColorタグの変更イベントの実行テスト", () => {
    test.each`
      changingColor
      ${TODO_COLOR.None}
      ${TODO_COLOR.Blue}
      ${TODO_COLOR.Green}
      ${TODO_COLOR.Orange}
      ${TODO_COLOR.Purple}
      ${TODO_COLOR.Red}
    `(
      "Colorタグを $changingColor に変更したら onChangeColor関数を呼ぶこと",
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
        queryClient.setQueryData<Todo[]>(["todos", { status, colors }], todos);
        render(
          <QueryClientProvider client={queryClient}>
            <TodoList />
          </QueryClientProvider>
        );

        // When: Colorタグを変更する
        const user = userEvent.setup();
        const selectBox = screen.getByLabelText("select-todo-color");
        await user.selectOptions(selectBox, changingColor);

        // Then: TodoのIDと変更するColorを渡して関数を1回呼び出すこと
        expect(mockedMutateTodoChangedColor.mock.calls[0][0]).toStrictEqual({
          id,
          color: changingColor,
        });
        expect(mockedMutateTodoChangedColor).toHaveBeenCalledTimes(1);
      }
    );
  });
  describe("Todoの削除イベントの実行テスト", () => {
    test("削除ボタンを押したら onClickDelete関数を呼ぶこと", async () => {
      // Given:TodoListを出力しTodoを１件渡す
      const id = "dummy-id";
      const todos: Todo[] = [
        {
          id,
          text: "Todoの削除イベントテスト",
          isCompleted: false,
          color: TODO_COLOR.None,
        },
      ];
      queryClient.setQueryData<Todo[]>(["todos", { status, colors }], todos);
      render(
        <QueryClientProvider client={queryClient}>
          <TodoList />
        </QueryClientProvider>
      );

      // When: Todoの削除ボタンを押す
      const user = userEvent.setup();
      const deleteButton = screen.getByRole("button", { name: "delete-todo" });
      await user.click(deleteButton);

      // Then: TodoのIDを渡して関数を1回呼び出すこと
      expect(mockedMutateTodoDeleted.mock.calls[0][0]).toStrictEqual({ id });
      expect(mockedMutateTodoDeleted).toHaveBeenCalledTimes(1);
    });
  });
});
