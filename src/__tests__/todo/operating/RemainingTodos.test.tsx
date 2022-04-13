import { render, screen } from "@testing-library/react";
import RemainingTodos from "../../../todo/operating/RemainingTodos";
import { QueryClient, QueryClientProvider } from "react-query";
import { TODO_COLOR, TodoColor } from "../../../todo/model/filter/TodoColors";
import { Todo } from "../../../todo/model/todo/Todo";
import { TODO_STATUS, TodoStatus } from "../../../todo/model/filter/TodoStatus";

const mockTodo1: Todo = {
  id: "1",
  text: "text",
  isCompleted: false,
  color: TODO_COLOR.None,
};
const mockTodo2: Todo = {
  id: "2",
  text: "text2",
  isCompleted: true,
  color: TODO_COLOR.Red,
};

describe("TodoListの件数によるメッセージの違い", () => {
  test.each`
    todos                               | message
    ${[mockTodo1] as Todo[]}            | ${"1 item left"}
    ${[mockTodo1, mockTodo2] as Todo[]} | ${"2 items left"}
    ${[] as Todo[]}                     | ${"0 item left"}
  `(
    "$todos の件数を' $message 'と出力する",
    ({ todos, message }: { todos: Todo[]; message: string }) => {
      // Given: TodoListの状態をqueryClientでキャッシュする
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: Infinity,
          },
        },
      });
      const status: TodoStatus = TODO_STATUS.ALL;
      const colors: TodoColor[] = [];
      queryClient.setQueryData<TodoStatus>(["status"], status);
      queryClient.setQueryData<TodoColor[]>(["colors"], colors);
      queryClient.setQueryData<Todo[]>(["todos", { status, colors }], todos);

      // When: コンポーネントを出力する
      render(
        <QueryClientProvider client={queryClient}>
          <RemainingTodos />
        </QueryClientProvider>
      );

      // Then: メッセージが出力されること
      expect(screen.getByText(message)).toBeInTheDocument();
    }
  );
});
