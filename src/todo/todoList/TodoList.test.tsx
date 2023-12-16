import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MutableSnapshot, RecoilRoot } from "recoil";
import { ReactNode } from "react";
import TodoList from "./TodoList";
import { Todo } from "../model/todo/Todo";
import { TODO_COLOR, TodoColor } from "../model/filter/TodoColors";
import { TODO_STATUS, TodoStatus } from "../model/filter/TodoStatus";
import { colorsFilterState, statusFilterState } from "../hooks/useTodos";
import { setMockedTodo } from "../../mocks/handlers";

const stateInitializer =
  (initState: TodoStatus = TODO_STATUS.ALL, initColors: TodoColor[] = []) =>
  ({ set }: MutableSnapshot) => {
    set<TodoStatus>(statusFilterState, initState);
    set<TodoColor[]>(colorsFilterState, initColors);
  };

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: Infinity } },
});

const ProviderWrapper = ({
  children,
  initState,
  initColors,
}: {
  children: ReactNode;
  initState: TodoStatus;
  initColors: TodoColor[];
}) => (
  <RecoilRoot initializeState={stateInitializer(initState, initColors)}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </RecoilRoot>
);

// queryClientのキャッシュをクリアしてからテストする
beforeEach(() => queryClient.clear());

describe("Todoの件数による表示テスト", () => {
  describe("表示されるTodo件数の検証", () => {
    const expectTexts: string[] = ["これは１つ目のTodoです", "This is a text in the second row"];
    test.each`
      text
      ${expectTexts[0]}
      ${expectTexts[1]}
    `("Todoが１件で $text を表示すること", async ({ text }: { text: string }) => {
      // Given: todosをセットする
      const todos: Todo[] = [
        {
          id: "dummy",
          text,
          isCompleted: false,
          color: TODO_COLOR.None,
        },
      ];
      setMockedTodo(todos);

      // When: コンポーネントを出力し、リストエリアが表示されるまで待つ
      render(
        <ProviderWrapper initColors={[]} initState={TODO_STATUS.ALL}>
          <TodoList />
        </ProviderWrapper>,
      );
      expect(await screen.findByRole("list", { name: "list-todo" })).toBeInTheDocument();

      // Then: 表示されるtodosを検証する
      const todoTexts = await screen.findAllByTestId("content-todo");
      expect(todoTexts).toHaveLength(1);
      expect(todoTexts[0].textContent).toBe(text);
    });

    test("Todoが2件の場合の表示", async () => {
      // Given: todosをセットする
      const todos: Todo[] = [
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
      setMockedTodo(todos);

      // When: コンポーネントを出力し、リストエリアが表示されるまで待つ
      render(
        <ProviderWrapper initColors={[]} initState={TODO_STATUS.ALL}>
          <TodoList />
        </ProviderWrapper>,
      );
      expect(await screen.findByRole("list", { name: "list-todo" })).toBeInTheDocument();

      // Then: 表示されるtodosを検証する
      const todoTexts = await screen.findAllByTestId("content-todo");
      expect(todoTexts).toHaveLength(2);
      todoTexts.forEach((todoText, index) => {
        expect(todoText.textContent).toBe(expectTexts[index]);
      });
    });

    test("Todoが0件ならリストは表示されない", async () => {
      // Given: todosをセットする
      setMockedTodo([]);

      // When: コンポーネントを出力し、リストエリアが表示されるまで待つ
      render(
        <ProviderWrapper initColors={[]} initState={TODO_STATUS.ALL}>
          <TodoList />
        </ProviderWrapper>,
      );
      expect(await screen.findByRole("list", { name: "list-todo" })).toBeInTheDocument();

      // Then: Todosが１件も表示されないこと
      const todoTexts = screen.queryAllByTestId("content-todo");
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
    `("$statusで絞るとTodoListは$count件になる", async ({ status, count }: { status: TodoStatus; count: number }) => {
      // Given: todosをセット
      setMockedTodo(todos);

      // When: コンポーネントを出力し、リストエリアが表示されるまで待つ
      render(
        <ProviderWrapper initState={status} initColors={[]}>
          <TodoList />
        </ProviderWrapper>,
      );

      expect(await screen.findByRole("list", { name: "list-todo" })).toBeInTheDocument();

      // Then: 表示されるtodosを検証する
      const todoItems = await screen.findAllByTestId("content-todo");
      expect(todoItems).toHaveLength(count);
    });

    test.each`
      colors                                                                                       | count
      ${[]}                                                                                        | ${9}
      ${[TODO_COLOR.Green]}                                                                        | ${1}
      ${[TODO_COLOR.Blue]}                                                                         | ${2}
      ${[TODO_COLOR.Green, TODO_COLOR.Blue]}                                                       | ${3}
      ${[TODO_COLOR.Blue, TODO_COLOR.Green, TODO_COLOR.Orange, TODO_COLOR.Purple, TODO_COLOR.Red]} | ${7}
    `("$colorsで絞るとTodoListは$count件になる", async ({ colors, count }: { colors: TodoColor[]; count: number }) => {
      // Given: Todoをセット
      setMockedTodo(todos);

      // When: コンポーネントを出力し、リストエリアが表示されるまで待つ
      render(
        <ProviderWrapper initState={TODO_STATUS.ALL} initColors={colors}>
          <TodoList />
        </ProviderWrapper>,
      );

      expect(await screen.findByRole("list", { name: "list-todo" })).toBeInTheDocument();

      // Then: 表示されるtodosを検証する
      const todoItems = await screen.findAllByTestId("content-todo");
      expect(todoItems).toHaveLength(count);
    });

    test.each`
      status                   | colors                                                                                       | count
      ${TODO_STATUS.ACTIVE}    | ${[]}                                                                                        | ${5}
      ${TODO_STATUS.ACTIVE}    | ${[TODO_COLOR.Green, TODO_COLOR.Blue]}                                                       | ${1}
      ${TODO_STATUS.ACTIVE}    | ${[TODO_COLOR.Blue, TODO_COLOR.Green, TODO_COLOR.Orange, TODO_COLOR.Purple, TODO_COLOR.Red]} | ${4}
      ${TODO_STATUS.COMPLETED} | ${[]}                                                                                        | ${4}
      ${TODO_STATUS.COMPLETED} | ${[TODO_COLOR.Green]}                                                                        | ${1}
      ${TODO_STATUS.COMPLETED} | ${[TODO_COLOR.Green, TODO_COLOR.Blue]}                                                       | ${2}
      ${TODO_STATUS.COMPLETED} | ${[TODO_COLOR.Blue, TODO_COLOR.Green, TODO_COLOR.Orange, TODO_COLOR.Purple, TODO_COLOR.Red]} | ${3}
    `(
      "$statusと$colorsで絞るとTodoListは$count件になる",
      async ({ status, colors, count }: { status: TodoStatus; colors: TodoColor[]; count: number }) => {
        // Given: todosをセット
        setMockedTodo(todos);

        // When: コンポーネントを出力し、リストエリアが表示されるまで待つ
        render(
          <ProviderWrapper initState={status} initColors={colors}>
            <TodoList />
          </ProviderWrapper>,
        );

        expect(await screen.findByRole("list", { name: "list-todo" })).toBeInTheDocument();

        // Then: 表示されるtodosを検証する。
        expect(await screen.findAllByTestId("content-todo")).toHaveLength(count);
      },
    );

    test("active と green で絞るとTodoListは0件になる", async () => {
      // Given: todosをセット
      setMockedTodo(todos);

      // When: コンポーネントを出力し、リストエリアが表示されるまで待つ
      render(
        <ProviderWrapper initState={TODO_STATUS.ACTIVE} initColors={[TODO_COLOR.Green]}>
          <TodoList />
        </ProviderWrapper>,
      );

      expect(await screen.findByRole("list", { name: "list-todo" })).toBeInTheDocument();

      // Then: 表示されるtodosを検証する。
      expect(screen.queryAllByTestId("content-todo")).toHaveLength(0);
    });
  });
});
