import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import StatusFilter from "./StatusFilter";
import { QueryClient, QueryClientProvider } from "react-query";

export default {
  component: StatusFilter,
  decorators: [
    (story) => (
      <QueryClientProvider client={new QueryClient()}>
        {story()}
      </QueryClientProvider>
    ),
  ],
} as ComponentMeta<typeof StatusFilter>;

export const Default: ComponentStoryObj<typeof StatusFilter> = {};
