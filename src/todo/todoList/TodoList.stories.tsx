import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import TodoList from "./TodoList";
import TodoItem from "./TodoItem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { RecoilRoot } from "recoil";

export default {
  component: TodoList,
  subcomponents: { TodoItem },
  parameters: {
    actions: {
      handles: ["click", "change"]
    }
  },
  decorators: [
    (story) => {
      // useQueryのリトライを無効にする(デフォルトが３回なので）
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false
          }
        }
      });
      return (
        <RecoilRoot>
          <QueryClientProvider client={queryClient}>
            {story()}
          </QueryClientProvider>
        </RecoilRoot>
      );
    }
  ]
} as ComponentMeta<typeof TodoList>;

export const Default: ComponentStoryObj<typeof TodoList> = {
  parameters: {
    storyshots: { disable: true }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(await canvas.findAllByTestId("content-todo")).toHaveLength(5);
  }
};
