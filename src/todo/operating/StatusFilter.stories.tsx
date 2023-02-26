import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import StatusFilter from "./StatusFilter";

const meta = {
  component: StatusFilter,
  decorators: [
    (story) => (
      <RecoilRoot>
        <QueryClientProvider client={new QueryClient()}>
          {story()}
        </QueryClientProvider>
      </RecoilRoot>
    ),
  ],
} satisfies Meta<typeof StatusFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
