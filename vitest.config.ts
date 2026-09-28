import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    pool: "threads",
    maxWorkers: 1,
    fileParallelism: false,
    testTimeout: 120_000,
    exclude: [...configDefaults.exclude, "tests/e2e/**"],
  },
});
