import { render, screen } from "@testing-library/react";
import StatusFilter from "../../../todo/operating/StatusFilter";

describe("ボタンの初期状態を検査する", () => {
  test.each`
    status         | isAll    | isActive | isCompleted
    ${"all"}       | ${true}  | ${false} | ${false}
    ${"active"}    | ${false} | ${true}  | ${false}
    ${"completed"} | ${false} | ${false} | ${true}
  `(
    "現在の検索状況が $status なら、All: $isAll Active: $isActive Completed $isCompleted であること",
    ({ status, isAll, isActive, isCompleted }) => {
      render(<StatusFilter status={status} />);

      const buttonAll = screen.getByRole("button", {
        name: "All",
        pressed: isAll,
      });
      const buttonActive = screen.getByRole("button", {
        name: "Active",
        pressed: isActive,
      });
      const buttonCompleted = screen.getByRole("button", {
        name: "Completed",
        pressed: isCompleted,
      });

      expect(buttonAll).toBeInTheDocument();
      expect(buttonActive).toBeInTheDocument();
      expect(buttonCompleted).toBeInTheDocument();
    }
  );
});
