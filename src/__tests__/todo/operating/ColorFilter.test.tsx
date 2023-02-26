import { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MutableSnapshot, RecoilRoot } from "recoil";
import {
  TODO_COLOR,
  TodoColor,
  TodoColors,
} from "../../../todo/model/filter/TodoColors";
import ColorFilter from "../../../todo/operating/ColorFilter";
import { colorsFilterState } from "../../../todo/hooks/useTodos";

// Recoilの初期Stateを渡す関数
const stateInitializer =
  (initialColors: TodoColor[]) =>
  ({ set }: MutableSnapshot) =>
    set<TodoColor[]>(colorsFilterState, initialColors);

// テストコンポーネントに状態管理をセットするWrapper
const ProviderWrapper = ({
  children,
  initialColors,
}: {
  children: ReactNode;
  initialColors: TodoColor[];
}) => (
  <RecoilRoot initializeState={stateInitializer(initialColors)}>
    {children}
  </RecoilRoot>
);

describe("カラーフィルターの初期値", () => {
  test("Noneを除く全ての色が表示され選択できること", () => {
    // Given: コンポーネントをレンダリングする
    render(
      <ProviderWrapper initialColors={[]}>
        <ColorFilter />
      </ProviderWrapper>
    );

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
    render(
      <ProviderWrapper initialColors={[]}>
        <ColorFilter />
      </ProviderWrapper>
    );
    expect(screen.getAllByRole("checkbox", { checked: false })).toHaveLength(
      TodoColors.length - 1
    );
  });

  test("Stateにセットされている色が初期選択されること", () => {
    const colors: TodoColor[] = [TODO_COLOR.Green, TODO_COLOR.Purple];
    render(
      <ProviderWrapper initialColors={colors}>
        <ColorFilter />
      </ProviderWrapper>
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

  test("Stateが未設定ならNoneを除く全てが未選択であること", () => {
    render(
      <ProviderWrapper initialColors={[]}>
        <ColorFilter />
      </ProviderWrapper>
    );
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
    "選択状況が$isSelectedの$checkColorを選択したら選択状況が変わること",
    async ({
      checkColor,
      isSelected,
    }: {
      checkColor: TodoColor;
      isSelected: boolean;
    }) => {
      // Given: ColorFilterの初期状態を設定する
      const colors: TodoColor[] = isSelected ? [checkColor] : [];
      render(
        <ProviderWrapper initialColors={colors}>
          <ColorFilter />
        </ProviderWrapper>
      );

      // When: Colorチェックボックスを選択する
      const checkbox = screen.getByRole("checkbox", { name: checkColor });
      const user = userEvent.setup();
      await user.click(checkbox);

      // Then: 選択済みだったら未選択、未選択だったら選択済みとなること
      expect(
        await screen.findByRole("checkbox", {
          name: checkColor,
          checked: !isSelected,
        })
      ).toBeInTheDocument();
    }
  );
});
