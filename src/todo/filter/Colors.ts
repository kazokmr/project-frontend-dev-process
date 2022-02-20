// Enumの代わりにconstアサーション(as const)でCOLORオブジェクトをreadonlyにする
export const COLOR = {
    Green: 'green',
    Blue: 'blue',
    Orange: 'orange',
    Purple: 'purple',
    Red: 'red'
} as const;

// Union typeを表現する
type Color = typeof COLOR[keyof typeof COLOR];

export const Colors = Object.values(COLOR);

export const capitalize = (color: string) => color.charAt(0).toUpperCase() + color.slice(1);
