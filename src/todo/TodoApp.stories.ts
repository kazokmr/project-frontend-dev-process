import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { rest } from "msw";
import TodoApp from "./TodoApp";
import { createMockedTodos } from "../mocks/handlers";

export default {
  component: TodoApp,
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
  },
} as ComponentMeta<typeof TodoApp>;

export const Default: ComponentStoryObj<typeof TodoApp> = {
  parameters: {
    msw: {
      handlers: [
        rest.get("/todos", (req, res, ctx) => {
          return res(ctx.json(createMockedTodos(5)));
        }),
      ],
    },
  },
};

export const Error: ComponentStoryObj<typeof TodoApp> = {
  parameters: {
    msw: {
      handlers: [
        rest.get("/todos", (req, res, ctx) => {
          return res(ctx.status(403));
        }),
      ],
    },
  },
};
