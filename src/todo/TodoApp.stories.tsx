import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { rest } from "msw";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { within } from "@storybook/testing-library";
import { RecoilRoot } from "recoil";
import TodoApp from "./TodoApp";

export default {
  component: TodoApp,
  parameters: {
    controls: {
      hideNoControlsWarning: true
    },
    actions: {
      handles: ["click .btn", "change"]
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
} as ComponentMeta<typeof TodoApp>;

export const Default: ComponentStoryObj<typeof TodoApp> = {
  parameters: {
    storyshots: { disable: true }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole("list", { name: "list-todo" });
  }
};

export const Error: ComponentStoryObj<typeof TodoApp> = {
  parameters: {
    msw: {
      handlers: {
        todos: rest.get("/todos", (req, res, ctx) =>
          // return:BAD_REQUEST,
           res(
            ctx.delay(0),
            ctx.status(400),
            ctx.json({ errorMessage: "これはエラーです" })
          )
        )
      }
    },
    storyshots: { disable: true }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText(/^Error!!:.+/);
  }
};
