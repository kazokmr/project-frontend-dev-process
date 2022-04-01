import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import StatusFilter from "./StatusFilter";
import { TODO_STATUS } from "../model/filter/TodoStatus";

export default {
  component: StatusFilter,
} as ComponentMeta<typeof StatusFilter>;

export const Default: ComponentStoryObj<typeof StatusFilter> = {
  argTypes: {
    curStatus: {
      options: [
        TODO_STATUS.ALL,
        TODO_STATUS.ACTIVE,
        TODO_STATUS.COMPLETED,
        undefined,
      ],
      control: "radio",
    },
  },
};
