import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TodoItem from "./TodoItem";
import { TODO_COLOR } from "../model/filter/TodoColors";
import { Todo } from "../model/todo/Todo";

export default {
  component: TodoItem,
  decorators: [
    (story) => (
      <QueryClientProvider client={new QueryClient()}>
        {story()}
      </QueryClientProvider>
    )
  ],
  parameters: {
    actions: {
      handles: ["click button", "change input", "change select"]
    }
  }
} as Meta<typeof TodoItem>;

export const Default: StoryObj<typeof TodoItem> = {
  name: "標準",
  args: {
    todo: {
      id: "dummy",
      text: "Storybookを学ぶ",
      isCompleted: false,
      color: TODO_COLOR.None
    }
  }
};

export const CompletedTodo: StoryObj<typeof TodoItem> = {
  name: "完了済みのTodo",
  args: {
    todo: {
      // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
      ...(Default.args?.todo as Todo),
      isCompleted: true
    }
  }
};
