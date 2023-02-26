// Enumの代わりにconstアサーション(as const)でCOLORオブジェクトをreadonlyにする
export const TODO_COLOR = {
  None: "",
  Green: "green",
  Blue: "blue",
  Orange: "orange",
  Purple: "purple",
  Red: "red",
} as const;

// Union typeを表現する
export type TodoColor = (typeof TODO_COLOR)[keyof typeof TODO_COLOR];

export const TodoColors = Object.values(TODO_COLOR);
