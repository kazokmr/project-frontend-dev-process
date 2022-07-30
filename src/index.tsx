import { StrictMode } from "react";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import { CssBaseline } from "@mui/material";

const prepare = async () => {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    await worker.start();
  }
};

const queryClient = new QueryClient();

prepare().then(() => {
  const container = document.getElementById("root");
  const root = createRoot(container!);
  root.render(
    <StrictMode>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <CssBaseline />
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </RecoilRoot>
    </StrictMode>
  );
});
