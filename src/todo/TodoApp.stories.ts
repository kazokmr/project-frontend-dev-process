import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { rest } from "msw";
import TodoApp from "./TodoApp";

export default {
  component: TodoApp,
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
  },
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
