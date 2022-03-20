import { render, screen } from "@testing-library/react";
import StatusFilter from "../../../todo/operating/StatusFilter";
import { TODO_STATUS, TodoStatus } from "../../../todo/model/filter/TodoStatus";
import { capitalize } from "../../../todo/model/filter/StringCapitalization";
import userEvent from "@testing-library/user-event";

const onClickStatus: jest.Mock = jest.fn();

describe("ボタンの初期状態を検査する", () => {
  test.each`
    status                   | isAll    | isActive | isCompleted
    ${TODO_STATUS.ALL}       | ${true}  | ${false} | ${false}
    ${TODO_STATUS.ACTIVE}    | ${false} | ${true}  | ${false}
    ${TODO_STATUS.COMPLETED} | ${false} | ${false} | ${true}
    ${undefined}             | ${true}  | ${false} | ${false}
  `(
    "現在の検索状況が $curStatus なら、All: $isAll Active: $isActive Completed $isCompleted であること",
    ({
      status,
      isAll,
      isActive,
      isCompleted,
    }: {
      status: TodoStatus;
      isAll: boolean;
      isActive: boolean;
      isCompleted: boolean;
    }) => {
      render(<StatusFilter curStatus={status} onClickStatus={onClickStatus} />);

      const buttonAll = screen.getByRole("button", {
        name: capitalize(TODO_STATUS.ALL),
        pressed: isAll,
      });
      const buttonActive = screen.getByRole("button", {
        name: capitalize(TODO_STATUS.ACTIVE),
        pressed: isActive,
      });
      const buttonCompleted = screen.getByRole("button", {
        name: capitalize(TODO_STATUS.COMPLETED),
        pressed: isCompleted,
      });

      expect(buttonAll).toBeInTheDocument();
      expect(buttonActive).toBeInTheDocument();
      expect(buttonCompleted).toBeInTheDocument();
    }
  );
});

describe("ボタンを押した時の動作を確認する", () => {
  test.each`
    filterName                           | status
    ${capitalize(TODO_STATUS.ALL)}       | ${TODO_STATUS.ALL}
    ${capitalize(TODO_STATUS.ACTIVE)}    | ${TODO_STATUS.ACTIVE}
    ${capitalize(TODO_STATUS.COMPLETED)} | ${TODO_STATUS.COMPLETED}
  `(
    "$filterNameボタンを押したらonClickStatus関数に$statusを渡して呼ぶこと",
    async ({
      filterName,
      status,
    }: {
      filterName: string;
      status: TodoStatus;
    }) => {
      // Given: コンポーネントを出力する
      render(<StatusFilter onClickStatus={onClickStatus} />);

      // When: ボタンを押す
      const filter = screen.getByRole("button", { name: filterName });
      const user = userEvent.setup();
      await user.click(filter);

      // Then: ステータスを引数に渡して関数を呼ぶ
      expect(onClickStatus.mock.calls[0][0]).toBe(status);
      expect(onClickStatus).toHaveBeenCalledTimes(1);
    }
  );
});
