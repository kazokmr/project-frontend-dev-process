import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import ActionsForTodos from "./ActionsForTodos";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
} as ComponentMeta<typeof ActionsForTodos>;

export const Default: ComponentStoryObj<typeof ActionsForTodos> = {};
