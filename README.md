# RepoWiki

> An agent skill for generating DeepWiki-style repository analysis reports.

RepoWiki deeply analyzes codebase architecture, module dependencies, and core systems, outputting structured documentation with Mermaid diagrams, source file references, and tables.

## Installation

Install via [skills.sh](https://skills.sh):

```bash
npx skills add zzzhizhia/repowiki
```

## Usage

In a coding agent session, use the slash command:

```
/repowiki
```

Or trigger with natural language:

- `generate repo report`
- `deepwiki`
- `analyze this repo`
- `generate project docs`
- `repository report`
- `codebase analysis`
- `generate wiki`

The report will be generated as `REPOWIKI.md` in the repository root.

## Report Structure

The generated report contains four layers:

| Layer | Content | Elements |
|-------|---------|----------|
| Project Overview | Positioning, tech stack, repo structure | Tech stack table, architecture diagram |
| Module Analysis | Module inventory, dependencies, internal architecture | Dependency graph, interface definitions |
| Core Systems | Deep analysis of each subsystem | Sequence diagrams, state diagrams, component tables |
| Infrastructure | Build, testing, CI/CD, dependency management | Flowcharts, configuration tables |
