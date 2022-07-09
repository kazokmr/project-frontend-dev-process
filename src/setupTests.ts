// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { server } from "./mocks/server";
import { setGlobalConfig } from "@storybook/testing-react";
import * as globalStorybookConfig from "../.storybook/preview";
import { GlobalConfig } from "@storybook/testing-react/dist/types";
server.printHandlers();
beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

setGlobalConfig(globalStorybookConfig as GlobalConfig);
