import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@fontsource/instrument-sans/latin-400";
import "@fontsource/instrument-sans/latin-500";
import "@fontsource/instrument-sans/latin-600";
import "@fontsource/instrument-sans/latin-700";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
