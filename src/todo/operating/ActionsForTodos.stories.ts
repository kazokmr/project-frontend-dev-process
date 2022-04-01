import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import ActionsForTodos from "./ActionsForTodos";

export default {
  component: ActionsForTodos,
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
  },
} as ComponentMeta<typeof ActionsForTodos>;

export const Default: ComponentStoryObj<typeof ActionsForTodos> = {};
