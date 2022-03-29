import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import OperatingTodos from "./OperatingTodos";
import { TODO_STATUS } from "../model/filter/TodoStatus";
import { TODO_COLOR } from "../model/filter/TodoColors";

const Meta: ComponentMeta<typeof OperatingTodos> = {
  component: OperatingTodos,
};
export default Meta;

export const Default: ComponentStoryObj<typeof OperatingTodos> = {
  argTypes: {
    numberOfTodos: {
      defaultValue: 1,
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
    curStatus: {
      options: [TODO_STATUS.ALL, TODO_STATUS.ACTIVE, TODO_STATUS.COMPLETED],
      control: { type: "inline-radio" },
    },
    curColors: {
      options: [
        TODO_COLOR.Green,
        TODO_COLOR.Blue,
        TODO_COLOR.Orange,
        TODO_COLOR.Purple,
        TODO_COLOR.Red,
      ],
      control: { type: "inline-check" },
    },
  },
};
