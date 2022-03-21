import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import ActionsForTodos from "../../../todo/operating/ActionsForTodos";

const onClickMarkAllCompleted: jest.Mock = jest.fn();

describe("アクション操作の呼び出しテスト", () => {
  test("MarkAllCompletedを押したら指定の関数を呼び出す", async () => {
    // Given: コンポーネントを出力する
    render(
      <ActionsForTodos onClickMarkAllCompleted={onClickMarkAllCompleted} />
    );

    // When: Mark All Completedをクリックする
    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: "Mark All Completed" });
    await user.click(button);

    // Then: 関数を実行する
    expect(onClickMarkAllCompleted).toHaveBeenCalledTimes(1);
  });
});
