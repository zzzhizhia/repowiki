import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import pc from "picocolors";
import { SKILL_PROMPT } from "./skill.js";

const HELP = `
repowiki — Generate a DeepWiki-style repository analysis report

Usage:
  repowiki [path]      Analyze the repo at <path> (default: current directory)
  repowiki --help      Show this help

Output:
  Writes REPOWIKI.md to the target directory.

Requirements:
  claude CLI must be installed and authenticated (https://claude.ai/code)
`.trim();

const ALLOWED_TOOLS = ["Write", "Read", "Bash", "Glob", "Grep"].join(",");

const USER_MESSAGE =
  "Analyze the current repository now and write the complete report to " +
  "`REPOWIKI.md` in the current directory using the Write tool. " +
  "Do not print the report to stdout.";

function printBox(output: string): void {
  const W = 60;
  console.log(pc.dim("┌─ claude " + "─".repeat(W - 9) + "┐"));
  for (const line of output.split("\n")) {
    console.log(pc.dim("│ ") + line);
  }
  console.log(pc.dim("└" + "─".repeat(W) + "┘"));
}

function run(targetDir: string): void {
  console.log(pc.dim(`Analyzing ${targetDir} ...`));

  const result = spawnSync(
    "claude",
    [
      "--print",
      "--model", "sonnet",
      "--effort", "medium",
      "--permission-mode", "dontAsk",
      "--allowedTools", ALLOWED_TOOLS,
      "--system-prompt", SKILL_PROMPT,
    ],
    {
      cwd: targetDir,
      input: USER_MESSAGE,
      stdio: ["pipe", "pipe", "inherit"],
    },
  );

  if (result.error) {
    const err = result.error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      console.error(
        pc.red(
          'claude CLI not found. Install it from https://claude.ai/code or run "npm install -g @anthropic-ai/claude-code".',
        ),
      );
    } else {
      console.error(pc.red(`Failed to run claude: ${err.message}`));
    }
    process.exit(1);
  }

  const output = (result.stdout?.toString() ?? "").trimEnd();
  if (output) printBox(output);

  if (result.status !== 0) {
    console.error(pc.red(`claude exited with code ${result.status ?? 1}`));
    process.exit(result.status ?? 1);
  }

  const outputPath = resolve(targetDir, "REPOWIKI.md");
  console.log(pc.green(`✓ Report written to ${outputPath}`));
}

function main(): void {
  const args = process.argv.slice(2);

  if (args[0] === "--help" || args[0] === "-h") {
    console.log(HELP);
    return;
  }

  const targetDir = resolve(args[0] ?? ".");
  run(targetDir);
}

// Symlink-safe entry guard
const currentFile = fileURLToPath(import.meta.url);
const isDirectRun =
  process.argv[1] != null &&
  resolve(realpathSync(process.argv[1])) === currentFile;

if (isDirectRun) {
  main();
}
