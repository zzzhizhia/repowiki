import { describe, it, expect } from "vitest";
import { SKILL_PROMPT } from "../skill.js";

describe("SKILL_PROMPT", () => {
  it("contains the required report structure sections", () => {
    expect(SKILL_PROMPT).toContain("# RepoWiki");
    expect(SKILL_PROMPT).toContain("## Analysis Execution Flow");
    expect(SKILL_PROMPT).toContain("REPOWIKI.md");
  });

  it("is a non-empty string", () => {
    expect(typeof SKILL_PROMPT).toBe("string");
    expect(SKILL_PROMPT.length).toBeGreaterThan(1000);
  });

  it("contains mermaid diagram instructions", () => {
    expect(SKILL_PROMPT).toContain("mermaid");
    expect(SKILL_PROMPT).toContain("sequenceDiagram");
  });
});
