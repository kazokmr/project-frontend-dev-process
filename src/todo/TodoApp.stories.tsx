import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { rest } from "msw";
import TodoApp from "./TodoApp";
import { QueryClient, QueryClientProvider } from "react-query";

export default {
  component: TodoApp,
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
    actions: {
      handles: ["click", "change"],
    },
  },
  decorators: [
    (story) => (
      <QueryClientProvider client={new QueryClient()}>
        {story()}
      </QueryClientProvider>
    ),
  ],
} as ComponentMeta<typeof TodoApp>;

export const Default: ComponentStoryObj<typeof TodoApp> = {};

export const Error: ComponentStoryObj<typeof TodoApp> = {
  parameters: {
    msw: {
      handlers: {
        todos: rest.get("/todos", (req, res, ctx) => {
          return res(ctx.status(403));
        }),
      },
    },
  },
};
