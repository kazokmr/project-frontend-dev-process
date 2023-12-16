import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import ColorFilter from "./ColorFilter";

const meta = {
  component: ColorFilter,
  decorators: [
    (story) => (
      <RecoilRoot>
        <QueryClientProvider client={new QueryClient()}>{story()}</QueryClientProvider>
      </RecoilRoot>
    ),
  ],
} satisfies Meta<typeof ColorFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
