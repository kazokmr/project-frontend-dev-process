import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TodoItem from "./TodoItem";
import { TODO_COLOR } from "../model/filter/TodoColors";
import { Todo } from "../model/todo/Todo";

const meta = {
  component: TodoItem,
  decorators: [(story) => <QueryClientProvider client={new QueryClient()}>{story()}</QueryClientProvider>],
  parameters: {
    actions: {
      handles: ["click button", "change input", "change select"],
    },
  },
} satisfies Meta<typeof TodoItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "標準",
  args: {
    todo: {
      id: "dummy",
      text: "Storybookを学ぶ",
      isCompleted: false,
      color: TODO_COLOR.None,
    },
  },
};

export const CompletedTodo: Story = {
  name: "完了済みのTodo",
  args: {
    todo: {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      ...(Default.args.todo as Todo),
      isCompleted: true,
    },
  },
};
