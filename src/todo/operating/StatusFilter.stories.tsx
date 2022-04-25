import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import StatusFilter from "./StatusFilter";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";

export default {
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
} as ComponentMeta<typeof StatusFilter>;

export const Default: ComponentStoryObj<typeof StatusFilter> = {};
