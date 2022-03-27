import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import NewTodo from "./NewTodo";

const meta: ComponentMeta<typeof NewTodo> = {
  component: NewTodo,
  title: "Todoの入力",
  argTypes: {
    addTodo: {
      name: "Todoの追加関数",
      type: { name: "function", required: true },
      description: "テキストに入力した文字をTodoにする",
      table: {
        type: {
          summary: "Todoを追加する関数",
          detail: "入力文字をTodoにする",
        },
      },
      control: { type: null },
      action: "Adding Todo",
    },
  },
};
export default meta;

export const Default: ComponentStoryObj<typeof NewTodo> = {
  storyName: "標準",
};
