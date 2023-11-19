import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RecoilRoot } from "recoil";
import { CssBaseline } from "@mui/material";
import { createRoot } from "react-dom/client";
import App from "./App";
import "../public/styles/global.css";

if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser");
  await worker.start();
}

const queryClient = new QueryClient();
const component = document.getElementById("root");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(component!);

root.render(
  <StrictMode>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </RecoilRoot>
  </StrictMode>,
);
