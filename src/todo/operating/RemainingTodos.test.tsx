import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RemainingTodos from "./RemainingTodos";
import { TODO_COLOR } from "../model/filter/TodoColors";
import { Todo } from "../model/todo/Todo";

const activeTodo1: Todo = {
  id: "1",
  text: "text",
  isCompleted: false,
  color: TODO_COLOR.None,
};
const activeTodo2: Todo = {
  id: "2",
  text: "text2",
  isCompleted: false,
  color: TODO_COLOR.Red,
};
const completeTodo: Todo = {
  id: "3",
  text: "text3",
  isCompleted: true,
  color: TODO_COLOR.Orange,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});

beforeEach(() => queryClient.clear());

describe("未完了のTodo件数を表示する", () => {
  test.each`
    todos                                       | message
    ${[activeTodo1] as Todo[]}                  | ${"1 item left"}
    ${[activeTodo1, activeTodo2] as Todo[]}     | ${"2 items left"}
    ${[] as Todo[]}                             | ${"0 item left"}
    ${[activeTodo1, activeTodo2, completeTodo]} | ${"2 items left"}
    ${[activeTodo1, activeTodo2]}               | ${"2 items left"}
    ${[activeTodo1, completeTodo]}              | ${"1 item left"}
    ${[completeTodo]}                           | ${"0 item left"}
  `("$todos から件数を' $message 'と出力する", ({ todos, message }: { todos: Todo[]; message: string }) => {
    // Given: TodoListの状態をqueryClientでキャッシュする
    queryClient.setQueryData<Todo[]>(["todos"], todos);

    // When: コンポーネントを出力する
    render(
      <QueryClientProvider client={queryClient}>
        <RemainingTodos />
      </QueryClientProvider>,
    );

    // Then: メッセージが出力されること
    expect(screen.getByText(message)).toBeInTheDocument();
  });
});
