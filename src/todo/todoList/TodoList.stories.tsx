import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import TodoList from "./TodoList";
import { Todo } from "../model/todo/Todo";
import { TODO_COLOR, TodoColor } from "../model/filter/TodoColors";
import TodoItem from "./TodoItem";
import { QueryClient, QueryClientProvider } from "react-query";
import { TODO_STATUS, TodoStatus } from "../model/filter/TodoStatus";

export default {
  component: TodoList,
  subcomponents: { TodoItem },
} as ComponentMeta<typeof TodoList>;

const todos: Todo[] = [
  { id: "1", text: "サンプル１", isCompleted: false, color: TODO_COLOR.None },
  { id: "2", text: "サンプル２", isCompleted: false, color: TODO_COLOR.Blue },
  { id: "3", text: "サンプル３", isCompleted: true, color: TODO_COLOR.Red },
];

export const Default: ComponentStoryObj<typeof TodoList> = {
  decorators: [
    (story) => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: Infinity } },
      });
      const status: TodoStatus = TODO_STATUS.ALL;
      const colors: TodoColor[] = [];
      queryClient.setQueryData<TodoStatus>(["status"], status);
      queryClient.setQueryData<TodoColor[]>(["colors"], colors);
      queryClient.setQueryData<Todo[]>(["todos", { status, colors }], todos);
      return (
        <QueryClientProvider client={queryClient}>
          {story()}
        </QueryClientProvider>
      );
    },
  ],
};
