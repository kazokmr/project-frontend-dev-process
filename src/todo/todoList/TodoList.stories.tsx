import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import TodoList from "./TodoList";
import TodoItem from "./TodoItem";
import { QueryClient, QueryClientProvider } from "react-query";

export default {
  component: TodoList,
  subcomponents: { TodoItem },
  decorators: [
    (story) => (
      <QueryClientProvider client={new QueryClient()}>
        {story()}
      </QueryClientProvider>
    ),
  ],
  parameters: {
    actions: {
      handles: ["click", "change"],
    },
  },
} as ComponentMeta<typeof TodoList>;

export const Default: ComponentStoryObj<typeof TodoList> = {};
