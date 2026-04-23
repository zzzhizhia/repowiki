import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import pc from "picocolors";
import { SKILL_PROMPT } from "./skill.js";

const HELP = `
repowiki — Generate a DeepWiki-style repository analysis report

Usage:
  repowiki [path] [-o OUTPUT]     Analyze the repo at <path> (default: .)
  repowiki --help                 Show this help

Options:
  -o, --output PATH     Output file path (default: <path>/REPOWIKI.md)

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

  console.log(pc.green(`✓ Report written to ${outputPath}`));
}

type ParsedArgs = { help: boolean; targetDir: string; output: string };

function parseArgs(argv: string[]): ParsedArgs {
  let help = false;
  let explicitOutput: string | null = null;
  const positional: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") {
      help = true;
    } else if (a === "-o" || a === "--output") {
      const val = argv[++i];
      if (val == null) {
        console.error(pc.red(`${a} requires a value`));
        process.exit(1);
      }
      explicitOutput = val;
    } else if (a.startsWith("-")) {
      console.error(pc.red(`Unknown flag: ${a}`));
      process.exit(1);
    } else {
      positional.push(a);
    }
  }

  const targetDir = resolve(positional[0] ?? ".");
  const output =
    explicitOutput != null
      ? resolve(explicitOutput)
      : resolve(targetDir, "REPOWIKI.md");

  return { help, targetDir, output };
}

function main(): void {
  const { help, targetDir, output } = parseArgs(process.argv.slice(2));

  if (help) {
    console.log(HELP);
    return;
  }

  run(targetDir, output);
}

// Symlink-safe entry guard
const currentFile = fileURLToPath(import.meta.url);
const isDirectRun =
  process.argv[1] != null &&
  resolve(realpathSync(process.argv[1])) === currentFile;

if (isDirectRun) {
  main();
}
