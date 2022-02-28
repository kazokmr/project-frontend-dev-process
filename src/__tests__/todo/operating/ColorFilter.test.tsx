import ColorFilter from "../../../todo/operating/ColorFilter";
import { render, screen } from "@testing-library/react";
import { TODO_COLOR, TodoColors } from "../../../todo/filter/TodoColors";
import userEvent from "@testing-library/user-event";

describe("カラーフィルターの初期値", () => {
  test("何も指定されていなければ全て未選択であること", () => {
    render(<ColorFilter curColors={[]} />);
    expect(screen.getAllByRole("checkbox", { checked: false })).toHaveLength(
      TodoColors.length
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
