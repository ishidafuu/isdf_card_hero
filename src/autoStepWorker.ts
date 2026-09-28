import { runAutoStep, runCpuStep } from "./game/rules";
import type { AutoStepWorkerRequest, AutoStepWorkerResponse } from "./autoStepWorkerProtocol";
import { shouldRunAutoStep } from "./game/seatControl";

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
    const strictSeatOptions = request.controllerBySeat
      ? {
          controllerBySeat: request.controllerBySeat,
          experimentalContext: request.experimentalContext,
          opponentKnowledgePolicy: request.opponentKnowledgePolicy,
        }
      : undefined;
    const game = strictSeatOptions && !shouldRunAutoStep(request.game, strictSeatOptions.controllerBySeat)
      ? structuredClone(request.game)
      : strictSeatOptions
        ? runAutoStep(request.game, {
            profiles: request.aiProfiles,
            experimentalContext: strictSeatOptions.experimentalContext,
            opponentKnowledgePolicy: strictSeatOptions.opponentKnowledgePolicy,
            reviewActorByPendingOwner: true,
          })
        : request.mode === "auto"
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
