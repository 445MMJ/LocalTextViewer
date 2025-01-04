import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TextViewer from "./text-viewer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TextViewer />
  </StrictMode>,
);
