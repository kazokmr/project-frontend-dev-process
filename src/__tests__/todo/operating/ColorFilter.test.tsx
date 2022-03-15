import ColorFilter from "../../../todo/operating/ColorFilter";
import { render, screen } from "@testing-library/react";
import { TODO_COLOR, TodoColors } from "../../../todo/model/filter/TodoColors";
import userEvent from "@testing-library/user-event";

describe("カラーフィルターの初期値", () => {
  test("Noneを除く全ての色が表示され選択できること", () => {
    // Given: コンポーネントをレンダリングする
    render(<ColorFilter curColors={[]} />);

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
    render(<ColorFilter curColors={[]} />);
    expect(screen.getAllByRole("checkbox", { checked: false })).toHaveLength(
      TodoColors.length - 1
    );
  });

  test("propsで指定された色が初期選択されること", () => {
    render(<ColorFilter curColors={[TODO_COLOR.Green, TODO_COLOR.Purple]} />);
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

  test("パラメータが渡されない場合はNoneを除く全てがｊｊ未選択であること", () => {
    render(<ColorFilter curColors={undefined} />);
    expect(screen.getAllByRole("checkbox", { checked: false })).toHaveLength(
      TodoColors.length - 1
    );
  });
});

// TODO: チェック状態のテストは stateを管理するフェーズで実施
describe.skip("checkboxの状態管理", () => {
  test("checked=falseを選択したらchecked=trueに更新する", async () => {
    const user = userEvent.setup();
    render(<ColorFilter curColors={[]} />);
    const checkbox = screen.getByRole("checkbox", { name: "Green" });
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  test("checked=trueを選択したらchecked=falseに更新する", async () => {
    const user = userEvent.setup();
    render(<ColorFilter curColors={["green"]} />);
    const checkbox = screen.getByRole("checkbox", { name: "Green" });
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
