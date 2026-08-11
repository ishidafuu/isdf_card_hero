import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    pool: "threads",
    maxWorkers: 1,
    fileParallelism: false,
    testTimeout: 120_000,
  },
});
