import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { within } from "@storybook/testing-library";
import { RecoilRoot } from "recoil";
import TodoList from "./TodoList";
import TodoItem from "./TodoItem";

const meta = {
  component: TodoList,
  // FIXME: [公式ドキュメント](https://storybook.js.org/docs/7.0/react/writing-stories/stories-for-multiple-components) ではこのように書かれているがエラーが出る。
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
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
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    storyshots: { disable: true }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findAllByTestId("content-todo");
  }
};
