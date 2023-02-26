import { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NewTodo from "./NewTodo";

const meta = {
  component: NewTodo,
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
    actions: {
      handles: ["change"],
    },
  },
  decorators: [
    (story) => (
      <QueryClientProvider client={new QueryClient()}>
        {story()}
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof NewTodo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "標準",
};

export const Interaction: Story = {
  name: "Todoを入力してEnter",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textBox = canvas.getByRole("textbox", { name: "input-todo" });
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await userEvent.click(textBox);
    await userEvent.keyboard("インタラクションテスト", { delay: 100 });
    setTimeout(() => userEvent.keyboard("{Enter}"), 1000);
  },
};
