import { existsSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import pc from "picocolors";
import { SKILL_PROMPT } from "./skill.js";
import { parseArgs } from "./args.js";

const HELP = `
repowiki — Generate a DeepWiki-style repository analysis report

Usage:
  repowiki [path] [-o OUTPUT]     Analyze the repo at <path> (default: .)
  repowiki --help                 Show this help

Options:
  -o, --output PATH     Output file path (default: <path>/REPOWIKI.md)
                        Relative paths resolve against the current directory,
                        not <path>.

Requirements:
  claude CLI must be installed and authenticated (https://claude.ai/code)
`.trim();

const ALLOWED_TOOLS = ["Write", "Read", "Bash", "Glob", "Grep"].join(",");

function printBox(output: string): void {
  const W = 60;
  console.log(pc.dim("┌─ claude " + "─".repeat(W - 9) + "┐"));
  for (const line of output.split("\n")) {
    console.log(pc.dim("│ ") + line);
  }
  console.log(pc.dim("└" + "─".repeat(W) + "┘"));
}

function run(targetDir: string, outputPath: string): void {
  if (!existsSync(targetDir) || !statSync(targetDir).isDirectory()) {
    console.error(pc.red(`Target is not a directory: ${targetDir}`));
    process.exit(1);
  }

  console.log(pc.dim(`Analyzing ${targetDir} → ${outputPath}`));

  const userMessage =
    `Analyze the current repository now and write the complete report to \`${outputPath}\` using the Write tool. ` +
    `Do not print the report to stdout.`;

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
      input: userMessage,
      stdio: ["pipe", "pipe", "inherit"],
    },
  );

  if (result.error) {
    const err = result.error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      // targetDir was pre-validated above, so ENOENT here means the claude
      // binary is missing from PATH.
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

  if (!existsSync(outputPath)) {
    console.error(
      pc.red(
        `claude exited successfully but ${outputPath} was not written. ` +
          `The report was not generated.`,
      ),
    );
    process.exit(1);
  }

  console.log(pc.green(`✓ Report written to ${outputPath}`));
}

function main(): void {
  let parsed;
  try {
    parsed = parseArgs(process.argv.slice(2), process.cwd());
  } catch (err) {
    console.error(pc.red((err as Error).message));
    process.exit(2);
  }

  if (parsed.help) {
    console.log(HELP);
    return;
  }

  run(parsed.targetDir, parsed.output);
}

// Symlink-safe entry guard
let isDirectRun = false;
try {
  const currentFile = fileURLToPath(import.meta.url);
  isDirectRun =
    process.argv[1] != null &&
    resolve(realpathSync(process.argv[1])) === currentFile;
} catch {
  // realpathSync may throw on unusual argv[1]; treat as non-direct run.
}

if (isDirectRun) {
  main();
}
