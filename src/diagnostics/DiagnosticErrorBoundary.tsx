import React from "react";
import {
  copyDiagnosticReport,
  createDiagnosticReport,
  downloadDiagnosticReport,
  type DiagnosticReport,
} from "./diagnosticReport";

interface DiagnosticErrorBoundaryProps {
  children: React.ReactNode;
}

interface DiagnosticErrorBoundaryState {
  error: Error | null;
  report: DiagnosticReport | null;
  actionMessage: string;
}

function makeFallbackReport(error: Error): DiagnosticReport {
  try {
    return createDiagnosticReport(error);
  } catch {
    return {
      format: "card-hero-diagnostic-v1",
      capturedAt: new Date().toISOString(),
      app: { name: "isdf_card_hero", version: "0.1.0" },
      error: { name: "RenderingError", message: "A rendering error occurred; details could not be collected." },
      gameContext: { status: "unavailable" },
    };
  }
}

function normalizeError(error: unknown): Error {
  if (error instanceof Error) return error;
  if (typeof error === "string") return new Error(error);
  try {
    return new Error(`A rendering error occurred (${String(error)}).`);
  } catch {
    return new Error("A rendering error occurred with a non-Error value.");
  }
}

export class DiagnosticErrorBoundary extends React.Component<DiagnosticErrorBoundaryProps, DiagnosticErrorBoundaryState> {
  state: DiagnosticErrorBoundaryState = { error: null, report: null, actionMessage: "" };

  componentDidMount(): void {
    window.addEventListener("error", this.handleWindowError);
    window.addEventListener("unhandledrejection", this.handleUnhandledRejection);
  }

  componentWillUnmount(): void {
    window.removeEventListener("error", this.handleWindowError);
    window.removeEventListener("unhandledrejection", this.handleUnhandledRejection);
  }

  static getDerivedStateFromError(error: unknown): Partial<DiagnosticErrorBoundaryState> {
    return { error: normalizeError(error) };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    this.setState({ report: makeFallbackReport(error), actionMessage: "" });
    // Component stacks are useful diagnostics, but must never compromise fallback rendering.
    try {
      const report = createDiagnosticReport(error, info);
      this.setState({ report });
    } catch {
      // Keep the minimal report produced above.
    }
  }

  private handleWindowError = (event: ErrorEvent): void => {
    if (this.state.error || (!event.error && !event.message)) return;
    const error = event.error ? normalizeError(event.error) : new Error(event.message || "Uncaught browser error");
    this.setState({ error, report: makeFallbackReport(error), actionMessage: "" });
  };

  private handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    if (this.state.error) return;
    const error = normalizeError(event.reason ?? "Unhandled promise rejection");
    this.setState({ error, report: makeFallbackReport(error), actionMessage: "" });
  };

  private getReport(): DiagnosticReport {
    return this.state.report ?? makeFallbackReport(this.state.error ?? new Error("Rendering error"));
  }

  private download = (): void => {
    try {
      downloadDiagnosticReport(this.getReport());
      this.setState({ actionMessage: "診断データを保存しました。" });
    } catch {
      this.setState({ actionMessage: "保存できませんでした。下のコピーをお試しください。" });
    }
  };

  private copy = async (): Promise<void> => {
    try {
      await copyDiagnosticReport(this.getReport());
      this.setState({ actionMessage: "診断データをコピーしました。" });
    } catch {
      this.setState({ actionMessage: "コピーできませんでした。ブラウザーの権限を確認してください。" });
    }
  };

  render(): React.ReactNode {
    if (!this.state.error) return this.props.children;
    return (
      <main
        role="alert"
        style={{
          boxSizing: "border-box",
          minHeight: "100vh",
          padding: "max(24px, env(safe-area-inset-top)) 20px 32px",
          background: "#111827",
          color: "#f9fafb",
          fontFamily: "system-ui, sans-serif",
          display: "grid",
          placeItems: "center",
        }}
      >
        <section style={{ width: "min(100%, 560px)" }}>
          <h1 style={{ fontSize: "1.5rem", margin: "0 0 12px" }}>画面を表示できませんでした</h1>
          <p style={{ color: "#d1d5db", lineHeight: 1.6, margin: "0 0 20px" }}>
            対局データを含む診断情報を保存またはコピーして、問題報告に添付できます。機密らしいキーや文字列は可能な範囲で秘匿します。共有前に内容をご確認ください。
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" onClick={this.download} style={buttonStyle}>診断データを保存</button>
            <button type="button" onClick={() => void this.copy()} style={buttonStyle}>診断データをコピー</button>
            <button type="button" onClick={() => window.location.reload()} style={secondaryButtonStyle}>再読み込み</button>
          </div>
          <p aria-live="polite" style={{ minHeight: "1.5em", color: "#d1d5db" }}>{this.state.actionMessage}</p>
          <details style={{ marginTop: 16, color: "#d1d5db" }}>
            <summary>エラー概要</summary>
            <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontSize: 12 }}>{this.getReport().error.message}</pre>
          </details>
        </section>
      </main>
    );
  }
}

const buttonStyle: React.CSSProperties = {
  border: 0,
  borderRadius: 8,
  padding: "11px 14px",
  background: "#fbbf24",
  color: "#111827",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "#374151",
  color: "#f9fafb",
};
