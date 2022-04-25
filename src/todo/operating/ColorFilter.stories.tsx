import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import ColorFilter from "./ColorFilter";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";

export default {
  component: ColorFilter,
  decorators: [
    (story) => (
      <RecoilRoot>
        <QueryClientProvider client={new QueryClient()}>
          {story()}
        </QueryClientProvider>
      </RecoilRoot>
    ),
  ],
} as ComponentMeta<typeof ColorFilter>;

export const Default: ComponentStoryObj<typeof ColorFilter> = {};
