import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import TodoList from "./TodoList";
import { Todo } from "../model/todo/Todo";
import { TODO_COLOR } from "../model/filter/TodoColors";
import TodoItem from "./TodoItem";

export default {
  component: TodoList,
  subcomponents: { TodoItem },
} as ComponentMeta<typeof TodoList>;

const todos: Todo[] = [
  { id: "1", text: "サンプル１", isCompleted: false, color: TODO_COLOR.None },
  { id: "2", text: "サンプル２", isCompleted: false, color: TODO_COLOR.Blue },
  { id: "3", text: "サンプル３", isCompleted: true, color: TODO_COLOR.Red },
];

export const Default: ComponentStoryObj<typeof TodoList> = {
  args: {
    todos,
  },
};
