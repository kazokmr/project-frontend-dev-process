import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MutableSnapshot, RecoilRoot } from "recoil";
import StatusFilter from "../../../todo/operating/StatusFilter";
import { TODO_STATUS, TodoStatus } from "../../../todo/model/filter/TodoStatus";
import { statusFilterState } from "../../../todo/hooks/useTodos";

const stateInitializer =
  (initialState: TodoStatus = TODO_STATUS.ALL) =>
    ({ set }: MutableSnapshot) =>
      set<TodoStatus>(statusFilterState, initialState);

describe("Radioボタンの初期状態をテストする", () => {
  test.each`
    status                   | isAll    | isActive | isCompleted
    ${TODO_STATUS.ALL}       | ${true}  | ${false} | ${false}
    ${TODO_STATUS.ACTIVE}    | ${false} | ${true}  | ${false}
    ${TODO_STATUS.COMPLETED} | ${false} | ${false} | ${true}
    ${undefined}             | ${true}  | ${false} | ${false}
  `(
    "現在の検索状況が $status なら、All: $isAll Active: $isActive Completed $isCompleted であること",
    ({
       status,
       isAll,
       isActive,
       isCompleted
     }: {
      status: TodoStatus;
      isAll: boolean;
      isActive: boolean;
      isCompleted: boolean;
    }) => {
      // Given: Statusに初期状態を渡す
      render(
        <RecoilRoot initializeState={stateInitializer(status)}>
          <StatusFilter />
        </RecoilRoot>
      );

      // When: Buttonを検索する
      const buttonAll = screen.getByRole("radio", {
        name: TODO_STATUS.ALL,
        checked: isAll
      });
      const buttonActive = screen.getByRole("radio", {
        name: TODO_STATUS.ACTIVE,
        checked: isActive
      });
      const buttonCompleted = screen.getByRole("radio", {
        name: TODO_STATUS.COMPLETED,
        checked: isCompleted
      });

      // Then: 設定されたStatusでボタンのPress状態が設定されていること
      expect(buttonAll).toBeInTheDocument();
      expect(buttonActive).toBeInTheDocument();
      expect(buttonCompleted).toBeInTheDocument();
    }
  );
});

describe("ボタンを押した時の動作を確認する", () => {
  test.each`
    filterName               | status
    ${TODO_STATUS.ALL}       | ${TODO_STATUS.ALL}
    ${TODO_STATUS.ACTIVE}    | ${TODO_STATUS.ACTIVE}
    ${TODO_STATUS.COMPLETED} | ${TODO_STATUS.COMPLETED}
  `(
    "$filterNameボタンを押したら Statusの状態が $statusとなること",
    async ({
             filterName,
             status
           }: {
      filterName: string;
      status: TodoStatus;
    }) => {
      // Given: Statusに初期状態を渡す
      render(
        <RecoilRoot initializeState={stateInitializer(status)}>
          <StatusFilter />
        </RecoilRoot>
      );

      // When: ボタンを押す
      const filter = screen.getByRole("radio", { name: filterName });
      const user = userEvent.setup();
      await user.click(filter);

      // Then: ボタンが押され、ステータスがセットされること
      expect(
        await screen.findByRole("radio", { name: filterName, checked: true })
      ).toBeInTheDocument();
    }
  );
});
