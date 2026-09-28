import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { DiagnosticErrorBoundary } from "./diagnostics/DiagnosticErrorBoundary";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DiagnosticErrorBoundary>
      <App />
    </DiagnosticErrorBoundary>
  </React.StrictMode>,
);
