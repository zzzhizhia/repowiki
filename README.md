# repowiki

Generate a DeepWiki-style repository analysis report with a single command.

## Quick Start

```bash
# one-off (no install required)
npx repowiki

# install globally
npm install -g repowiki
repowiki
```

## Usage

```bash
# analyze the current directory
repowiki

# analyze a specific repo
repowiki /path/to/repo

# custom output path
repowiki -o wiki.md
repowiki /path/to/repo -o ~/reports/wiki.md

# show help
repowiki --help
```

## Options

| Flag | Default | Description |
|------|---------|-------------|
| `-o`, `--output PATH` | `<path>/REPOWIKI.md` | Output file path |
| `-h`, `--help` | — | Show help |

## Output

Writes a Markdown report to the output path (default `REPOWIKI.md` in the target directory) containing:

- Project overview, tech stack table, and architecture diagrams
- Module inventory and dependency graphs (Mermaid)
- Deep analysis of core systems with sequence diagrams and design decision tables
- Infrastructure: build, testing, CI/CD, and dependency management

## Requirements

- Node >= 20
- [Claude Code CLI](https://claude.ai/code) installed and authenticated

## How It Works

`repowiki` calls `claude --model sonnet --effort medium --print` with a carefully crafted analysis prompt, then writes the response to `REPOWIKI.md`. The analysis runs entirely inside Claude Code's codebase-aware context, so no files are uploaded anywhere.

## As a Claude Code Skill

Install the underlying skill directly into your Claude Code agent:

```bash
npx skills add zzzhizhia/repowiki
```

Then trigger it with `/repowiki` or natural language like "generate repo report".

## License

MIT
