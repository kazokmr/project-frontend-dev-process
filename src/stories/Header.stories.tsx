import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Header, HeaderProps } from "./Header";

export default {
  title: "Example/Header",
  component: Header,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = ({
  user,
  onLogin,
  onLogout,
  onCreateAccount,
}: HeaderProps) => (
  <Header
    user={user}
    onLogin={onLogin}
    onLogout={onLogout}
    onCreateAccount={onCreateAccount}
  />
);

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: {
    name: "Jane Doe",
  },
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};
