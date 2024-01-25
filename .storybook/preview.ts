import { initialize, mswLoader } from "msw-storybook-addon";
import { handlers } from "../src/mocks/handlers";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
    expanded: true,
  },
  msw: {
    handlers: {
      todos: handlers,
    },
  },
};

export const loaders = [mswLoader];

initialize({
  serviceWorker: {
    url: "./mockServiceWorker.js",
  },
});
