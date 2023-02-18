import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import ColorFilter from "./ColorFilter";

export default {
  component: ColorFilter,
  decorators: [
    (story) => (
      <RecoilRoot>
        <QueryClientProvider client={new QueryClient()}>
          {story()}
        </QueryClientProvider>
      </RecoilRoot>
    )
  ]
} as Meta<typeof ColorFilter>;

export const Default: StoryObj<typeof ColorFilter> = {};
