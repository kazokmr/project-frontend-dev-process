import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import ActionsForTodos from "./ActionsForTodos";

const Meta: ComponentMeta<typeof ActionsForTodos> = {
  component: ActionsForTodos,
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
  },
};
export default Meta;

export const Default: ComponentStoryObj<typeof ActionsForTodos> = {};
