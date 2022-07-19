import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import NewTodo from "./NewTodo";
import { userEvent, within } from "@storybook/testing-library";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default {
  component: NewTodo,
  parameters: {
    controls: {
      hideNoControlsWarning: true
    },
    actions: {
      handles: ["change"]
    }
  },
  decorators: [
    (story) => (
      <QueryClientProvider client={new QueryClient()}>
        {story()}
      </QueryClientProvider>
    )
  ]
} as ComponentMeta<typeof NewTodo>;

export const Default: ComponentStoryObj<typeof NewTodo> = {
  storyName: "標準"
};

export const Interaction: ComponentStoryObj<typeof NewTodo> = {
  storyName: "Todoを入力してEnter",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("textbox", { name: "input-todo" }));
    await userEvent.keyboard("インタラクションテスト", { delay: 100 });
    setTimeout(() => userEvent.keyboard("{Enter}"), 1000);
  }
};
