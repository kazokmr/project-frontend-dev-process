import "../src/index.css";
import "../src/App.css";
import "../src/todo/TodoApp.css";
import { initialize, mswDecorator } from "msw-storybook-addon";
import { handlers } from "../src/mocks/handlers";

initialize();

export const decorators = [mswDecorator];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    },
    expanded: true
  },
  msw: {
    handlers: {
      todos: handlers
    }
  }
};

