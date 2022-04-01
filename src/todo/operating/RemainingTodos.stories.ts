import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import RemainingTodos from "./RemainingTodos";

export default {
  component: RemainingTodos,
} as ComponentMeta<typeof RemainingTodos>;

export const Default: ComponentStoryObj<typeof RemainingTodos> = {
  storyName: "ActiveなTodoが１件",
  args: {
    numOfTodo: 1,
  },
};

export const NoActiveTodo: ComponentStoryObj<typeof RemainingTodos> = {
  storyName: "ActiveなTodoが0件",
  args: {
    numOfTodo: 0,
  },
};

export const MultiActiveTodo: ComponentStoryObj<typeof RemainingTodos> = {
  storyName: "ActiveなTodoが2件",
  args: {
    numOfTodo: 2,
  },
  argTypes: {
    numOfTodo: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
};
