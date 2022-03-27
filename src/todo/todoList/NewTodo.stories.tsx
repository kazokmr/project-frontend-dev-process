import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import NewTodo from "./NewTodo";

const meta: ComponentMeta<typeof NewTodo> = {
  component: NewTodo,
  argTypes: {
    addTodo: {
      description: "テキストに入力した文字をTodoにする",
      action: "Adding Todo",
    },
  },
};
export default meta;

export const Default: ComponentStoryObj<typeof NewTodo> = {
  storyName: "標準",
};
