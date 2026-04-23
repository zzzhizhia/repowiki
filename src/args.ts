import { resolve } from "node:path";

export type ParsedArgs =
  | { help: true }
  | { help: false; targetDir: string; output: string };

export function parseArgs(argv: string[], cwd: string): ParsedArgs {
  let explicitOutput: string | null = null;
  const positional: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];

    if (a === "--help" || a === "-h") return { help: true };

    if (a.startsWith("--output=")) {
      const val = a.slice("--output=".length);
      if (!val) throw new Error("--output requires a value");
      explicitOutput = val;
      continue;
    }

    if (a === "-o" || a === "--output") {
      const val = argv[++i];
      if (val == null || val.startsWith("-")) {
        throw new Error(`${a} requires a value`);
      }
      explicitOutput = val;
      continue;
    }

    if (a.startsWith("-")) throw new Error(`Unknown flag: ${a}`);

    positional.push(a);
  }

  if (positional.length > 1) {
    throw new Error(
      `Too many positional arguments: expected at most 1 path, got ${positional.length}`,
    );
  }

  const targetDir = resolve(cwd, positional[0] ?? ".");
  const output =
    explicitOutput != null
      ? resolve(cwd, explicitOutput)
      : resolve(targetDir, "REPOWIKI.md");

  return { help: false, targetDir, output };
}
