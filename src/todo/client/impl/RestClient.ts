/* eslint-disable class-methods-use-this */
import axios, { AxiosError } from "axios";
import { HttpClient } from "../HttpClient";
import { Todo } from "../../model/todo/Todo";
import { TodoColor } from "../../model/filter/TodoColors";

export const baseUrl = "https://example.com";
axios.defaults.baseURL = baseUrl;

export class RestClient implements HttpClient {
  queryTodos = async (): Promise<Todo[]> =>
    axios
      .get("/todos")
      .then((response) => response.data as Todo[])
      .catch((error: AxiosError) => {
        // Requestを送信してResponseも返っている -> Statusが20X以外
        if (error.response) {
          const { errorMessage } = error.response.data as {
            errorMessage: string;
          };
          throw new Error(`HTTPステータス: ${error.response.status}: ${errorMessage}`);
        }
        // Requestを送信したがResponseが返ってこない -> Networkエラー
        if (error.request) {
          throw new Error(`サーバーエラー: ${error.message}`);
        }
        // 上記以外のリクエスト送信までの予期せぬエラー
        throw new Error(`予期せぬエラー: ${(error as Error).message}`);
      });

  addTodo = async (text: string): Promise<Todo> => {
    const response = await axios.post("/todo", { text });
    return response.data as Todo;
  };

  completeTodo = (id: string): Promise<void> => axios.put(`/todo/${id}/complete`);

  changeColor = (id: string, color: TodoColor): Promise<void> => axios.put(`/todo/${id}/changeColor`, { color });

  deleteTodo = (id: string): Promise<void> => axios.delete(`/todo/${id}`);

  completeAllTodos = (): Promise<void> => axios.put("/todo/completeAll");

  deleteCompletedTodos = (): Promise<void> => axios.put("/todo/deleteCompleted");
}
