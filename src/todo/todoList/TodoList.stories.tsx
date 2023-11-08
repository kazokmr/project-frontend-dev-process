import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { within } from "@storybook/testing-library";
import { Suspense } from "react";
import { RecoilRoot } from "recoil";
import TodoList from "./TodoList";

const meta = {
  component: TodoList,
  parameters: {
    actions: {
      handles: ["click", "change"],
    },
  },
  decorators: [
    (story) => (
      <RecoilRoot>
        <QueryClientProvider client={new QueryClient()}>
          <Suspense>{story()}</Suspense>
        </QueryClientProvider>
      </RecoilRoot>
    ),
  ],
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findAllByTestId("content-todo");
  },
};
