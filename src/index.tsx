import { StrictMode } from "react";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RecoilRoot } from "recoil";
import { CssBaseline } from "@mui/material";
import { render } from "react-dom";
import App from "./App";

if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser");
  await worker.start();
}

const queryClient = new QueryClient();

render(
  <StrictMode>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </RecoilRoot>
  </StrictMode>,
  document.getElementById("root")
);
