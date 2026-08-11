import { runAutoStep, runCpuStep } from "./game/rules";
import type { AutoStepWorkerRequest, AutoStepWorkerResponse } from "./autoStepWorkerProtocol";

interface WorkerScope {
  onmessage: ((event: MessageEvent<AutoStepWorkerRequest>) => void) | null;
  postMessage: (message: AutoStepWorkerResponse) => void;
}

const workerScope = globalThis as unknown as WorkerScope;

workerScope.onmessage = (event) => {
  const request = event.data;
  if (request?.type !== "step") {
    return;
  }
  try {
    const game = request.mode === "auto"
      ? runAutoStep(request.game, { profiles: request.aiProfiles })
      : runCpuStep(request.game, { profiles: request.aiProfiles });
    workerScope.postMessage({
      type: "result",
      requestId: request.requestId,
      battleGeneration: request.battleGeneration,
      gameVersion: request.gameVersion,
      game,
    });
  } catch (error) {
    workerScope.postMessage({
      type: "error",
      requestId: request.requestId,
      battleGeneration: request.battleGeneration,
      gameVersion: request.gameVersion,
      error: error instanceof Error ? error.message : "CPU処理に失敗しました",
    });
  }
};
