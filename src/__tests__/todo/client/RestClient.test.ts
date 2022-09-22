import { rest } from "msw";
import { server } from "../../../mocks/server";
import { baseUrl, RestClient } from "../../../todo/client/impl/RestClient";
import { HttpClient } from "../../../todo/client/HttpClient";

describe("エラーハンドリングの検証", () => {
  test("GETリクエストを送信したらエラーが返って来た場合", async () => {

    // Given: GET /todos リクエストを受けたらエラーステータスを返す
    server.use(rest.get(`${baseUrl}/todos`, (req, res, ctx) =>
      res(
        ctx.status(500),
        ctx.json({ errorMessage: "エラーが発生しました" })
      )));

    // When: GET /todos リクエストを送信する
    const client: HttpClient = new RestClient();

    // Then: 例外が返ること
    await expect(client.queryTodos()).rejects.toThrow(new Error("HTTPステータス: 500: エラーが発生しました"));
  });
});