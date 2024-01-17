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

let options = {};

switch (location.host) {
  // Production (assetsをGithubPagesから提供）
  case "kazokmr.github.io":
    options = {
      serviceWorker: {
        url: "/project-frontend-dev-process/mockServiceWorker.js",
      },
    };
    break;
  // Preview (assetsをローカルのIntelliJ組み込みWebサーバーから提供)
  case "localhost:63342":
    options = {
      serviceWorker: {
        url: "/project-frontend-dev-process/storybook-static/mockServiceWorker.js",
      },
    };
    break;
  // Dev (storybook dev で起動)
  default:
    options = {
      serviceWorker: {
        url: "./mockServiceWorker.js",
      },
    };
}

initialize(options);
