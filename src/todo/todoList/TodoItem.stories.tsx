import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import TodoItem from "./TodoItem";
import { TODO_COLOR } from "../model/filter/TodoColors";
import { Todo } from "../model/todo/Todo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
} as ComponentMeta<typeof TodoItem>;

export const Default: ComponentStoryObj<typeof TodoItem> = {
  storyName: "標準",
  args: {
    todo: {
      id: "dummy",
      text: "Storybookを学ぶ",
      isCompleted: false,
      color: TODO_COLOR.None
    }
  }
};

export const CompletedTodo: ComponentStoryObj<typeof TodoItem> = {
  storyName: "完了済みのTodo",
  args: {
    todo: {
      ...(Default.args?.todo as Todo),
      isCompleted: true
    }
  }
};
