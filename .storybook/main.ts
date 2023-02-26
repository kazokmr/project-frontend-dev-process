// eslint-disable-next-line import/no-import-module-exports

import {StorybookConfig} from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: "@storybook/react-vite",
  viteFinal(inlineConfig) {
    return inlineConfig;
  },
  docs: {
    autodocs: true,
  },
};

export default config;