import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ActionsForTodos from "./ActionsForTodos";

const meta = {
  component: ActionsForTodos,
  decorators: [
    (story) => (
      <QueryClientProvider client={new QueryClient()}>
        {story()}
      </QueryClientProvider>
    ),
  ],
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
  },
} satisfies Meta<typeof ActionsForTodos>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
