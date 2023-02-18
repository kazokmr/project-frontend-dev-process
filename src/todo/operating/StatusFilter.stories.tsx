import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import StatusFilter from "./StatusFilter";

export default {
  component: StatusFilter,
  decorators: [
    (story) => (
      <RecoilRoot>
        <QueryClientProvider client={new QueryClient()}>
          {story()}
        </QueryClientProvider>
      </RecoilRoot>
    )
  ]
} as Meta<typeof StatusFilter>;

export const Default: StoryObj<typeof StatusFilter> = {};
