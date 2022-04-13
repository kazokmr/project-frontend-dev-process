import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import RemainingTodos from "./RemainingTodos";
import { QueryClient, QueryClientProvider } from "react-query";
import { Todo } from "../model/todo/Todo";
import { TODO_STATUS, TodoStatus } from "../model/filter/TodoStatus";
import { TODO_COLOR, TodoColor } from "../model/filter/TodoColors";

export default {
  component: RemainingTodos,
} as ComponentMeta<typeof RemainingTodos>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const status: TodoStatus = TODO_STATUS.ALL;
const colors: TodoColor[] = [];

export const Default: ComponentStoryObj<typeof RemainingTodos> = {
  storyName: "ActiveなTodoが１件",
  decorators: [
    (story) => {
      queryClient.clear();
      queryClient.setQueryData<TodoStatus>(["status"], status);
      queryClient.setQueryData<TodoColor[]>(["colors"], colors);
      queryClient.setQueryData<Todo[]>(
        ["todos", { status, colors }],
        [
          {
            id: "1",
            text: "hogehoge",
            isCompleted: false,
            color: TODO_COLOR.None,
          },
        ]
      );
      return (
        <QueryClientProvider client={queryClient}>
          {story()}
        </QueryClientProvider>
      );
    },
  ],
};

export const NoActiveTodo: ComponentStoryObj<typeof RemainingTodos> = {
  storyName: "ActiveなTodoが0件",
  decorators: [
    (story) => {
      queryClient.clear();
      queryClient.setQueryData<TodoStatus>(["status"], status);
      queryClient.setQueryData<TodoColor[]>(["colors"], colors);
      queryClient.setQueryData<Todo[]>(["todos", { status, colors }], []);
      return (
        <QueryClientProvider client={queryClient}>
          {story()}
        </QueryClientProvider>
      );
    },
  ],
};

export const MultiActiveTodo: ComponentStoryObj<typeof RemainingTodos> = {
  storyName: "ActiveなTodoが2件",
  decorators: [
    (story) => {
      queryClient.clear();
      queryClient.setQueryData<TodoStatus>(["status"], status);
      queryClient.setQueryData<TodoColor[]>(["colors"], colors);
      queryClient.setQueryData<Todo[]>(
        ["todos", { status, colors }],
        [
          {
            id: "1",
            text: "hogehoge",
            isCompleted: false,
            color: TODO_COLOR.None,
          },
          {
            id: "2",
            text: "hogehoge",
            isCompleted: false,
            color: TODO_COLOR.None,
          },
        ]
      );
      return (
        <QueryClientProvider client={queryClient}>
          {story()}
        </QueryClientProvider>
      );
    },
  ],
};
