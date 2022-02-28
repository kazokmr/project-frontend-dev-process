export const TODO_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
} as const;

export type TodoStatus = typeof TODO_STATUS[keyof typeof TODO_STATUS];
