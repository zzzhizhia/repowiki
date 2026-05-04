# Changelog

## 1.2.0 (2026-05-05)

- Add `-v`/`--version` flag
- Render Claude output with markdown formatting (glow CLI / chalk+marked fallback), replacing ASCII box
- Add progress hint during analysis ("this may take a minute")
- Add actionable suggestions to error messages
- Add example output section to README
- Add CI workflow for PRs
- Replace `picocolors` with `chalk` + `marked`

## 1.1.0 (2026-04-23)

- Add `-o`/`--output` flag for custom report path
- Render Claude output with markdown formatting (glow / chalk+marked fallback)
- Use `--system-prompt` and Write tool directly for cleaner execution

## 1.0.0 (2026-04-16)

- Initial release
- `npx repowiki` generates a DeepWiki-style analysis report via Claude Code CLI
- Outputs `REPOWIKI.md` with architecture diagrams, module analysis, and Mermaid charts
