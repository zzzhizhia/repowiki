import { realpathSync, writeFileSync } from "node:fs";
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

function printHelp(): void {
  console.log(HELP);
}

function run(targetDir: string): void {
  console.log(pc.dim(`Analyzing ${targetDir} ...`));

  const result = spawnSync(
    "claude",
    ["--model", "sonnet", "--effort", "medium", "--print"],
    {
      cwd: targetDir,
      encoding: "utf-8",
      input: SKILL_PROMPT,
      stdio: ["pipe", "pipe", "inherit"],
      maxBuffer: 64 * 1024 * 1024, // 64 MB
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

  if (result.status !== 0) {
    console.error(pc.red(`claude exited with code ${result.status}`));
    process.exit(result.status ?? 1);
  }

  const output = result.stdout.trim();
  if (!output) {
    console.error(pc.red("claude returned empty output"));
    process.exit(1);
  }

  const outputPath = resolve(targetDir, "REPOWIKI.md");
  writeFileSync(outputPath, output + "\n");
  console.log(pc.green(`Report written to ${outputPath}`));
}

function main(): void {
  const args = process.argv.slice(2);

  if (args[0] === "--help" || args[0] === "-h") {
    printHelp();
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
