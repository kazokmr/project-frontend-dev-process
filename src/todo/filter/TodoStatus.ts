export const TODO_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
} as const;

export type Todo_Status = typeof TODO_STATUS[keyof typeof TODO_STATUS];
