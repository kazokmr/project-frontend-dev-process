/* jshint esversion: 6 */
"use strict";
import "../src/index.css";
import "../src/App.css";
import "../src/todo/TodoApp.css";
import { initialize, mswDecorator } from "msw-storybook-addon";
import { rest } from "msw";
import { Todo } from "../src/todo/model/todo/Todo";
import { TODO_COLOR } from "../src/todo/model/filter/TodoColors";

initialize();

export const decorators = [mswDecorator];

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
      todos: [
        rest.get("/todos", (req, res, ctx) => {
          return res(ctx.json(mockedTodos));
        }),
        rest.post("/addTodo", (req, res, ctx) => {
          const todo = new Todo(req.body.text);
          return res(ctx.status(200), ctx.json(todo));
        }),
      ],
    },
  },
};

const mockedTodos = [
  {
    id: "1",
    text: "君も今日もっとこの推薦性という事のためが参りですん。",
    isCompleted: true,
    color: TODO_COLOR.Red,
  },
  {
    id: "2",
    text: "主義を説きないのは無論事実でどうしてもたなた。",
    isCompleted: false,
    color: TODO_COLOR.Green,
  },
  {
    id: "3",
    text: "場合をはできるだけありて違ったんたでし",
    isCompleted: true,
    color: TODO_COLOR.Blue,
  },
  {
    id: "4",
    text: "引用欠くて、これらの.も色濃くでも係るますませ。",
    isCompleted: true,
    color: TODO_COLOR.Green,
  },
  {
    id: "5",
    text: "あるいは、ここを問題にすることを「侵害権」の投稿ある。",
    isCompleted: false,
    color: TODO_COLOR.None,
  },
];
