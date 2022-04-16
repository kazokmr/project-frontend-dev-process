import { render, screen } from "@testing-library/react";
import TodoList from "../../../todo/todoList/TodoList";
import { Todo } from "../../../todo/model/todo/Todo";
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

beforeEach(() => {
  // テストごとにQueryClientを初期化する
  queryClient.clear();
});

describe("Todoの件数による表示テスト", () => {
  describe("表示されるTodo件数の検証", () => {
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
      queryClient.setQueryData<Todo[]>(["todos"], todos);
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
      queryClient.setQueryData<Todo[]>(["todos"], todos);
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
      queryClient.setQueryData<Todo[]>(["todos"], []);
      render(
        <QueryClientProvider client={queryClient}>
          <TodoList />
        </QueryClientProvider>
      );
      const todoTexts = screen.queryAllByLabelText("content-todo");
      expect(todoTexts).toHaveLength(0);
    });
  });
  describe("filterで表示するTodoが絞り込まれるか検証", () => {
    const todos: Todo[] = [
      { id: "1", text: "１件目", isCompleted: false, color: TODO_COLOR.None },
      { id: "2", text: "２件目", isCompleted: true, color: TODO_COLOR.Blue },
      { id: "3", text: "３件目", isCompleted: true, color: TODO_COLOR.Red },
      { id: "4", text: "４件目", isCompleted: false, color: TODO_COLOR.Blue },
      { id: "5", text: "５件目", isCompleted: false, color: TODO_COLOR.Purple },
      { id: "6", text: "６件目", isCompleted: false, color: TODO_COLOR.Red },
      { id: "7", text: "７件目", isCompleted: true, color: TODO_COLOR.Green },
      { id: "8", text: "８件目", isCompleted: false, color: TODO_COLOR.Red },
      { id: "9", text: "９件目", isCompleted: true, color: TODO_COLOR.None },
    ];
    test.each`
      status                   | count
      ${TODO_STATUS.ALL}       | ${9}
      ${TODO_STATUS.ACTIVE}    | ${5}
      ${TODO_STATUS.COMPLETED} | ${4}
    `(
      "$statusで絞るとTodoListは$count件になる",
      ({ status, count }: { status: TodoStatus; count: number }) => {
        // Given: クライアントキャッシュにqueryをセットする
        queryClient.setQueryData<TodoStatus>(["status"], status);
        queryClient.setQueryData<TodoColor[]>(["colors"], []);
        queryClient.setQueryData<Todo[]>(["todos"], todos);

        // When: TodoListコンポーネントを出力しTodo件数を取得する
        render(
          <QueryClientProvider client={queryClient}>
            <TodoList />
          </QueryClientProvider>
        );
        const todoItems = screen.queryAllByTestId("content-todo");

        // Then: 標準されるTodoを検証する
        expect(todoItems).toHaveLength(count);
      }
    );
    test.each`
      colors                                                                                       | count
      ${[]}                                                                                        | ${9}
      ${[TODO_COLOR.Green]}                                                                        | ${1}
      ${[TODO_COLOR.Blue]}                                                                         | ${2}
      ${[TODO_COLOR.Green, TODO_COLOR.Blue]}                                                       | ${3}
      ${[TODO_COLOR.Blue, TODO_COLOR.Green, TODO_COLOR.Orange, TODO_COLOR.Purple, TODO_COLOR.Red]} | ${7}
    `(
      "$colorsで絞るとTodoListは$count件になる",
      ({ colors, count }: { colors: TodoColor[]; count: number }) => {
        // Given: クライアントキャッシュにqueryをセットする
        queryClient.setQueryData<TodoStatus>(["status"], TODO_STATUS.ALL);
        queryClient.setQueryData<TodoColor[]>(["colors"], colors);
        queryClient.setQueryData<Todo[]>(["todos"], todos);

        // When: TodoListコンポーネントを出力しTodo件数を取得する
        render(
          <QueryClientProvider client={queryClient}>
            <TodoList />
          </QueryClientProvider>
        );
        const todoItems = screen.queryAllByTestId("content-todo");

        // Then: 標準されるTodoを検証する
        expect(todoItems).toHaveLength(count);
      }
    );
    test.each`
      status                   | colors                                                                                       | count
      ${TODO_STATUS.ACTIVE}    | ${[]}                                                                                        | ${5}
      ${TODO_STATUS.ACTIVE}    | ${[TODO_COLOR.Green]}                                                                        | ${0}
      ${TODO_STATUS.ACTIVE}    | ${[TODO_COLOR.Green, TODO_COLOR.Blue]}                                                       | ${1}
      ${TODO_STATUS.ACTIVE}    | ${[TODO_COLOR.Blue, TODO_COLOR.Green, TODO_COLOR.Orange, TODO_COLOR.Purple, TODO_COLOR.Red]} | ${4}
      ${TODO_STATUS.COMPLETED} | ${[]}                                                                                        | ${4}
      ${TODO_STATUS.COMPLETED} | ${[TODO_COLOR.Green]}                                                                        | ${1}
      ${TODO_STATUS.COMPLETED} | ${[TODO_COLOR.Green, TODO_COLOR.Blue]}                                                       | ${2}
      ${TODO_STATUS.COMPLETED} | ${[TODO_COLOR.Blue, TODO_COLOR.Green, TODO_COLOR.Orange, TODO_COLOR.Purple, TODO_COLOR.Red]} | ${3}
    `(
      "$statusと$colorsで絞るとTodoListは$count件になる",
      ({
        status,
        colors,
        count,
      }: {
        status: TodoStatus;
        colors: TodoColor[];
        count: number;
      }) => {
        // Given: クライアントキャッシュにqueryをセットする
        queryClient.setQueryData<TodoStatus>(["status"], status);
        queryClient.setQueryData<TodoColor[]>(["colors"], colors);
        queryClient.setQueryData<Todo[]>(["todos"], todos);

        // When: TodoListコンポーネントを出力しTodo件数を取得する
        render(
          <QueryClientProvider client={queryClient}>
            <TodoList />
          </QueryClientProvider>
        );
        const todoItems = screen.queryAllByTestId("content-todo");

        // Then: 標準されるTodoを検証する
        expect(todoItems).toHaveLength(count);
      }
    );
  });
});
