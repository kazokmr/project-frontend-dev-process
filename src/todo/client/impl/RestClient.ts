/* eslint-disable class-methods-use-this */
import axios from "axios";
import { HttpClient } from "../HttpClient";
import { Todo } from "../../model/todo/Todo";
import { TodoColor } from "../../model/filter/TodoColors";

export const baseUrl = "https://example.com";
axios.defaults.baseURL = baseUrl;

export class RestClient implements HttpClient {
  queryTodos = async (): Promise<Todo[]> => {
    try {
      const response = await axios.get("/todos");
      return response.data as Todo[];
    } catch (err) {
      // Axiosから返るエラーの場合
      if (axios.isAxiosError(err)) {
        // レスポンスが返ってきた場合
        if (err.response) {
          const { errorMessage } = err.response.data as {
            errorMessage: string;
          };
          throw new Error(
            `HTTPステータス: ${err.response.status}: ${errorMessage}`,
          );
        } else {
          throw new Error(`サーバーエラー: ${err.message}`);
        }
      } else {
        // Axios以外の想定外エラー
        throw new Error(`予期せぬエラー: ${(err as Error).message}`);
      }
    }
  };

  addTodo = async (text: string): Promise<Todo> => {
    const response = await axios.post("/todo", { text });
    return response.data as Todo;
  };

  completeTodo = (id: string): Promise<void> =>
    axios.put(`/todo/${id}/complete`);

  changeColor = (id: string, color: TodoColor): Promise<void> =>
    axios.put(`/todo/${id}/changeColor`, { color });

  deleteTodo = (id: string): Promise<void> => axios.delete(`/todo/${id}`);

  completeAllTodos = (): Promise<void> => axios.put("/todo/completeAll");

  deleteCompletedTodos = (): Promise<void> =>
    axios.put("/todo/deleteCompleted");
}
