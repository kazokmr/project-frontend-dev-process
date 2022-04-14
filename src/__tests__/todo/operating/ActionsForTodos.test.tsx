import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import ActionsForTodos from "../../../todo/operating/ActionsForTodos";

// useTodoをMock化し、useMutationTodoAdded().mutateをモック関数で返す
const mockedMutateCompleteAllTodos: jest.Mock = jest.fn();
const mockedMutateDeleteCompletedTodos: jest.Mock = jest.fn();

jest.mock("../../../todo/hooks/useTodos", () => ({
  useMutationCompleteAllTodos: () => ({
    mutate: mockedMutateCompleteAllTodos,
  }),
  useMutationDeleteCompletedTodos: () => ({
    mutate: mockedMutateDeleteCompletedTodos,
  }),
}));

describe("アクション操作の呼び出しテスト", () => {
  test("MarkAllCompletedを押したらServerAPIをコールするMutationを実行すること", async () => {
    // Given: コンポーネントを出力する
    render(<ActionsForTodos />);

    // When: Mark All Completedをクリックする
    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: "Mark All Completed" });
    await user.click(button);

    // Then: 関数を実行する
    expect(mockedMutateCompleteAllTodos).toHaveBeenCalledTimes(1);
  });

  test("Clear Completed を押したらServerAPIをコールするMutationを実行すること", async () => {
    // Given: コンポーネントを出力する
    render(<ActionsForTodos />);

    // When: Clear Completedをクリックする
    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: "Clear Completed" });
    await user.click(button);

    // Then:関数を実行する
    expect(mockedMutateDeleteCompletedTodos).toHaveBeenCalledTimes(1);
  });
});
