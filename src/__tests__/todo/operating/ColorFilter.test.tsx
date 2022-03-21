import ColorFilter from "../../../todo/operating/ColorFilter";
import { render, screen } from "@testing-library/react";
import {
  TODO_COLOR,
  TodoColor,
  TodoColors,
} from "../../../todo/model/filter/TodoColors";
import userEvent from "@testing-library/user-event";
import { capitalize } from "../../../todo/model/filter/StringCapitalization";

const onChangeColor: jest.Mock = jest.fn();

describe("カラーフィルターの初期値", () => {
  test("Noneを除く全ての色が表示され選択できること", () => {
    // Given: コンポーネントをレンダリングする
    render(<ColorFilter curColors={[]} onChangeColor={onChangeColor} />);

    // When: フィルタ要素のname配列を取得する
    const filterNames = screen
      .getAllByRole("checkbox")
      .map((e) => e.getAttribute("name"));

    // Then: Noneを除く全ての色が取得できること
    expect(filterNames).not.toContain(TODO_COLOR.None);
    // 同じ条件でソートして配列が一致することを確認する
    expect(filterNames.sort()).toEqual(
      TodoColors.filter((color) => color !== TODO_COLOR.None).sort()
    );
  });

  test("Noneを除く全てが未選択であること", () => {
    render(<ColorFilter curColors={[]} onChangeColor={onChangeColor} />);
    expect(screen.getAllByRole("checkbox", { checked: false })).toHaveLength(
      TodoColors.length - 1
    );
  });

  test("propsで指定された色が初期選択されること", () => {
    render(
      <ColorFilter
        curColors={[TODO_COLOR.Green, TODO_COLOR.Purple]}
        onChangeColor={onChangeColor}
      />
    );
    expect(
      screen
        .getAllByRole("checkbox", { checked: true })
        .map((e) => e.getAttribute("name"))
    ).toEqual(["green", "purple"]);
    expect(
      screen
        .getAllByRole("checkbox", { checked: false })
        .map((e) => e.getAttribute("name"))
    ).toEqual(["blue", "orange", "red"]);
  });

  test("パラメータが渡されない場合はNoneを除く全てが未選択であること", () => {
    render(<ColorFilter curColors={[]} onChangeColor={onChangeColor} />);
    expect(screen.getAllByRole("checkbox", { checked: false })).toHaveLength(
      TodoColors.length - 1
    );
  });
});

describe("checkboxの状態管理のテスト", () => {
  test.each`
    checkColor           | isSelected
    ${TODO_COLOR.Blue}   | ${false}
    ${TODO_COLOR.Blue}   | ${true}
    ${TODO_COLOR.Green}  | ${false}
    ${TODO_COLOR.Green}  | ${true}
    ${TODO_COLOR.Orange} | ${false}
    ${TODO_COLOR.Orange} | ${true}
    ${TODO_COLOR.Purple} | ${false}
    ${TODO_COLOR.Purple} | ${true}
    ${TODO_COLOR.Red}    | ${false}
    ${TODO_COLOR.Red}    | ${true}
  `(
    "選択状況が$isSelectedの$checkColorを選択したらonChangeColor関数の引数に渡されること",
    async ({
      checkColor,
      isSelected,
    }: {
      checkColor: TodoColor;
      isSelected: boolean;
    }) => {
      // Given: 選択中のColorが一つもない状態でコンポーネントを表示する
      const colors: TodoColor[] = isSelected ? [checkColor] : [];
      render(<ColorFilter curColors={colors} onChangeColor={onChangeColor} />);

      // When: Colorチェックボックスを選択する
      const checkbox = screen.getByRole("checkbox", {
        name: capitalize(checkColor),
      });
      const user = userEvent.setup();
      await user.click(checkbox);

      // Then: onClickColor関数に引数を渡すこと
      expect(onChangeColor.mock.calls[0][0]).toBe(checkColor);
      expect(onChangeColor.mock.calls[0][1]).toBe(!isSelected);
      expect(onChangeColor).toHaveBeenCalledTimes(1);
    }
  );
});
