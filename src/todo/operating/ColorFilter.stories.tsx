import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
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
} as ComponentMeta<typeof ColorFilter>;

export const Default: ComponentStoryObj<typeof ColorFilter> = {};
