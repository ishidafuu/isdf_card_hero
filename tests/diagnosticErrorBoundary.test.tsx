// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DiagnosticErrorBoundary } from "../src/diagnostics/DiagnosticErrorBoundary";

let root: Root | undefined;
let container: HTMLDivElement | undefined;
const originalCreateObjectUrl = Object.getOwnPropertyDescriptor(URL, "createObjectURL");
Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", { configurable: true, value: true });

afterEach(() => {
  if (root) act(() => root?.unmount());
  root = undefined;
  container?.remove();
  container = undefined;
  if (originalCreateObjectUrl) Object.defineProperty(URL, "createObjectURL", originalCreateObjectUrl);
  else Reflect.deleteProperty(URL, "createObjectURL");
  vi.restoreAllMocks();
});

function renderBoundary(child: React.ReactNode): HTMLDivElement {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root?.render(<DiagnosticErrorBoundary>{child}</DiagnosticErrorBoundary>));
  return container;
}

function ThrowingChild({ thrown }: { thrown: unknown }): React.ReactNode {
  throw thrown;
}

describe("DiagnosticErrorBoundary", () => {
  it("catches a real descendant render error and keeps the fallback available when exports fail", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => { throw new Error("download blocked"); }),
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("clipboard denied")) },
    });
    const output = renderBoundary(<ThrowingChild thrown={new Error("expected test render error")} />);

    expect(output.querySelector('[role="alert"]')?.textContent).toContain("画面を表示できませんでした");
    const buttons = [...output.querySelectorAll("button")];
    await act(async () => buttons[0]?.click());
    expect(output.textContent).toContain("保存できませんでした");
    await act(async () => buttons[1]?.click());
    expect(output.textContent).toContain("コピーできませんでした");
    expect(output.querySelector('[role="alert"]')).not.toBeNull();
  });

  it("turns uncaught promise rejection into a recoverable diagnostic screen", async () => {
    const output = renderBoundary(<p>正常画面</p>);
    await act(async () => {
      const rejection = new Event("unhandledrejection") as PromiseRejectionEvent;
      Object.defineProperty(rejection, "reason", { value: new Error("async failure") });
      window.dispatchEvent(rejection);
    });
    expect(output.querySelector('[role="alert"]')?.textContent).toContain("画面を表示できませんでした");
  });

  it("turns an uncaught browser error into a recoverable diagnostic screen", () => {
    const output = renderBoundary(<p>正常画面</p>);
    const error = new Error("browser failure");
    act(() => window.dispatchEvent(new ErrorEvent("error", { error, message: error.message })));
    expect(output.querySelector('[role="alert"]')?.textContent).toContain("画面を表示できませんでした");
  });

  it.each([null, 0, "plain thrown value"]) ("keeps the fallback when a child throws %s", (thrown) => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const output = renderBoundary(<ThrowingChild thrown={thrown} />);
    expect(output.querySelector('[role="alert"]')?.textContent).toContain("画面を表示できませんでした");
  });
});
