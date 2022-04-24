import { StrictMode } from "react";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { createRoot } from "react-dom/client";

const prepare = () => {
  if (process.env.NODE_ENV === "development") {
    const { worker } = require("./mocks/browser");
    return worker.start();
  }
  return Promise.resolve();
};

const queryClient = new QueryClient();

prepare().then(() => {
  const container = document.getElementById("root");
  const root = createRoot(container!);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
