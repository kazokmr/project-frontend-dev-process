import { http, HttpResponse } from "msw";
import { server } from "../../../mocks/server";
import { baseUrl, RestClient } from "../../../todo/client/impl/RestClient";
import { HttpClient } from "../../../todo/client/HttpClient";

describe("エラーハンドリングの検証", () => {
  test("GETリクエストを送信したらエラーが返って来た場合", async () => {
    // Given: GET /todos リクエストを受けたらエラーステータスを返す
    server.use(
      http.get(`${baseUrl}/todos`, () =>
        HttpResponse.json(
          {
            errorMessage: "エラーが発生しました",
          },
          {
            status: 500,
          },
        ),
      ),
    );

    // When: GET /todos リクエストを送信する
    const client: HttpClient = new RestClient();

    // Then: 例外が返ること
    await expect(client.queryTodos()).rejects.toThrow(
      new Error("HTTPステータス: 500: エラーが発生しました"),
    );
  });
  test("ネットワークエラーが発生した場合", async () => {
    // Given: MSWでネットワークエラーを発生させる
    server.use(http.get(`${baseUrl}/todos`, () => HttpResponse.error()));

    // When
    const client: HttpClient = new RestClient();

    // Then
    await expect(client.queryTodos()).rejects.toThrow(
      new Error("サーバーエラー: Network Error"),
    );
  });
});
