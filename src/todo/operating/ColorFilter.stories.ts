import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import ColorFilter from "./ColorFilter";
import { TODO_COLOR } from "../model/filter/TodoColors";

export default {
  component: ColorFilter,
} as ComponentMeta<typeof ColorFilter>;

export const Default: ComponentStoryObj<typeof ColorFilter> = {
  argTypes: {
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
