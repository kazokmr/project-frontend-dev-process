import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NewTodo from "./NewTodo";

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
    const textBox = canvas.getByRole("textbox", { name: "input-todo" });
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await userEvent.click(textBox);
    await userEvent.keyboard("インタラクションテスト", { delay: 100 });
    setTimeout(() => userEvent.keyboard("{Enter}"), 1000);
  }
};
