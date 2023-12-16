import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RemainingTodos from "./RemainingTodos";
import { Todo } from "../model/todo/Todo";
import { TODO_COLOR } from "../model/filter/TodoColors";

const meta = {
  component: RemainingTodos,
} satisfies Meta<typeof RemainingTodos>;

export default meta;
type Story = StoryObj<typeof meta>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

export const Default: Story = {
  name: "ActiveなTodoが１件",
  decorators: [
    (story) => {
      queryClient.clear();
      queryClient.setQueryData<Todo[]>(
        ["todos"],
        [
          {
            id: "1",
            text: "hogehoge",
            isCompleted: false,
            color: TODO_COLOR.None,
          },
        ],
      );
      return <QueryClientProvider client={queryClient}>{story()}</QueryClientProvider>;
    },
  ],
};

export const NoActiveTodo: Story = {
  name: "ActiveなTodoが0件",
  decorators: [
    (story) => {
      queryClient.clear();
      queryClient.setQueryData<Todo[]>(["todos"], []);
      return <QueryClientProvider client={queryClient}>{story()}</QueryClientProvider>;
    },
  ],
};

export const MultiActiveTodo: Story = {
  name: "ActiveなTodoが2件",
  decorators: [
    (story) => {
      queryClient.clear();
      queryClient.setQueryData<Todo[]>(
        ["todos"],
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
        ],
      );
      return <QueryClientProvider client={queryClient}>{story()}</QueryClientProvider>;
    },
  ],
};
