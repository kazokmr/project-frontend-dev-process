import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import NewTodo from "./NewTodo";
import { userEvent, within } from "@storybook/testing-library";

const Meta: ComponentMeta<typeof NewTodo> = {
  component: NewTodo,
  argTypes: {
    addTodo: {
      description: "テキストに入力した文字をTodoにする",
      action: "Adding Todo",
    },
  },
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
  },
};
export default Meta;

export const Default: ComponentStoryObj<typeof NewTodo> = {
  storyName: "標準",
};

export const Interaction: ComponentStoryObj<typeof NewTodo> = {
  storyName: "Todoを入力してEnter",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("textbox", { name: "input-todo" }));
    await userEvent.keyboard("インタラクションテスト", { delay: 100 });
    setTimeout(() => userEvent.keyboard("{Enter}"), 1000);
  },
};
