import JSDOMEnvironment from "jest-environment-jsdom";

export default class FixJSDOMEnvironment extends JSDOMEnvironment {
  constructor(...args: ConstructorParameters<typeof JSDOMEnvironment>) {
    super(...args);

    // Jest で Node.jsの globalsを使うための設定。
    // jest-environment-jsdomでGlobalsが上書きされ利用できなくなるので追加する
    // 他にも fetch, Blog, Headers, FormDataもあるが現在のテストでは使わないので省略
    // https://mswjs.io/docs/migrations/1.x-to-2.x#requestresponsetextencoder-is-not-defined-jest
    this.global.TextEncoder = TextEncoder;
    this.global.TextDecoder = TextDecoder;
    this.global.Response = Response;
    this.global.Request = Request;
  }
}
