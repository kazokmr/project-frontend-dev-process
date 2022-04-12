import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import ColorFilter from "./ColorFilter";
import { QueryClient, QueryClientProvider } from "react-query";

export default {
  component: ColorFilter,
  decorators: [
    (story) => (
      <QueryClientProvider client={new QueryClient()}>
        {story()}
      </QueryClientProvider>
    ),
  ],
} as ComponentMeta<typeof ColorFilter>;

export const Default: ComponentStoryObj<typeof ColorFilter> = {};
