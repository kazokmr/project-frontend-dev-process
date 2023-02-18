import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ActionsForTodos from "./ActionsForTodos";

export default {
  component: ActionsForTodos,
  decorators: [
    (story) => (
      <QueryClientProvider client={new QueryClient()}>
        {story()}
      </QueryClientProvider>
    )
  ],
  parameters: {
    controls: {
      hideNoControlsWarning: true
    }
  }
} as Meta<typeof ActionsForTodos>;

export const Default: StoryObj<typeof ActionsForTodos> = {};
