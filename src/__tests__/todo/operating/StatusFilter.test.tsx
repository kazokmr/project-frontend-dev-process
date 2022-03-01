import { render, screen } from "@testing-library/react";
import StatusFilter from "../../../todo/operating/StatusFilter";
import { TODO_STATUS } from "../../../todo/model/filter/TodoStatus";
import { capitalize } from "../../../todo/model/filter/StringCapitalization";

describe("ボタンの初期状態を検査する", () => {
  test.each`
    status                   | isAll    | isActive | isCompleted
    ${TODO_STATUS.ALL}       | ${true}  | ${false} | ${false}
    ${TODO_STATUS.ACTIVE}    | ${false} | ${true}  | ${false}
    ${TODO_STATUS.COMPLETED} | ${false} | ${false} | ${true}
    ${undefined}             | ${true}  | ${false} | ${false}
  `(
    "現在の検索状況が $curStatus なら、All: $isAll Active: $isActive Completed $isCompleted であること",
    ({ status, isAll, isActive, isCompleted }) => {
      render(<StatusFilter curStatus={status} />);

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
