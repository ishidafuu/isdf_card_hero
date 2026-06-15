import { formatMasterLabMarkdown, validateMasterLabCandidates } from "../src/game/masterLab";

const issues = validateMasterLabCandidates();
console.log(formatMasterLabMarkdown());

if (issues.some((issue) => issue.severity === "error")) {
  process.exitCode = 1;
}
