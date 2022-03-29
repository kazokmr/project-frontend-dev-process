import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import StatusFilter from "./StatusFilter";
import { TODO_STATUS } from "../model/filter/TodoStatus";

const Meta: ComponentMeta<typeof StatusFilter> = {
  component: StatusFilter,
};
export default Meta;

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
