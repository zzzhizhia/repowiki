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
| `-o`, `--output PATH` | `<path>/REPOWIKI.md` | Output file path. Relative paths resolve against the current directory, not `<path>`. |
| `-h`, `--help` | — | Show help |

## Example Output

The generated `REPOWIKI.md` includes:

- **Project overview** -- positioning, tech stack table, and a repository structure Mermaid diagram
- **Architecture** -- core system overview graph and module dependency map
- **Module deep-dives** -- responsibility boundaries, internal architecture diagrams, key interface code blocks, and sequence diagrams for critical workflows
- **Infrastructure** -- build pipeline flowchart, test strategy table, CI/CD diagram, and dependency management notes

<details>
<summary>Sample report structure (click to expand)</summary>

```
# RepoWiki: <project-name>

## 1. Project Overview
   - Positioning & description
   - Tech stack table
   - Repository structure (Mermaid graph TD)
   - Core system overview (Mermaid graph LR)

## 2. Design Philosophy
   - Core principles
   - Technical decision table

## 3. Module Deep Analysis
   ### 3.1 <module-name>
   - Responsibility & boundaries
   - Internal architecture (Mermaid graph TD)
   - Key interfaces (code blocks)
   - Workflow (Mermaid sequenceDiagram)

## 4. Infrastructure
   - Build pipeline (Mermaid flowchart LR)
   - Test strategy table
   - CI/CD pipeline (Mermaid flowchart TD)
   - Dependency management
```

</details>

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
