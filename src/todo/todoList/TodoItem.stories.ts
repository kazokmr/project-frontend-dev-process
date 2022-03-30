import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import TodoItem from "./TodoItem";
import { TODO_COLOR } from "../model/filter/TodoColors";
import { Todo } from "../model/todo/Todo";

const Meta: ComponentMeta<typeof TodoItem> = {
  component: TodoItem,
};
export default Meta;

export const Default: ComponentStoryObj<typeof TodoItem> = {
  storyName: "標準",
  args: {
    todo: {
      id: "dummy",
      text: "Storybookを学ぶ",
      isCompleted: false,
      color: TODO_COLOR.None,
    },
  },
};

export const CompletedTodo: ComponentStoryObj<typeof TodoItem> = {
  storyName: "完了済みのTodo",
  args: {
    todo: {
      ...(Default.args?.todo as Todo),
      isCompleted: true,
    },
  },
};
