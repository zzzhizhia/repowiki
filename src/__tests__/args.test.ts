import { describe, it, expect } from "vitest";
import { parseArgs } from "../args.js";

const CWD = "/home/user";

describe("parseArgs", () => {
  it("defaults target to cwd and output to REPOWIKI.md", () => {
    expect(parseArgs([], CWD)).toEqual({
      help: false,
      targetDir: "/home/user",
      output: "/home/user/REPOWIKI.md",
    });
  });

  it("accepts a positional path", () => {
    expect(parseArgs(["/tmp/repo"], CWD)).toEqual({
      help: false,
      targetDir: "/tmp/repo",
      output: "/tmp/repo/REPOWIKI.md",
    });
  });

  it("-o resolves relative to cwd, not targetDir", () => {
    expect(parseArgs(["/tmp/repo", "-o", "wiki.md"], CWD)).toEqual({
      help: false,
      targetDir: "/tmp/repo",
      output: "/home/user/wiki.md",
    });
  });

  it("--output=PATH inline form", () => {
    expect(parseArgs(["--output=wiki.md"], CWD).help).toBe(false);
    const r = parseArgs(["--output=wiki.md"], CWD);
    if (r.help) throw new Error("unreachable");
    expect(r.output).toBe("/home/user/wiki.md");
  });

  it("absolute -o path used as-is", () => {
    const r = parseArgs(["-o", "/tmp/w.md"], CWD);
    if (r.help) throw new Error("unreachable");
    expect(r.output).toBe("/tmp/w.md");
  });

  it("--help and -h return help", () => {
    expect(parseArgs(["--help"], CWD)).toEqual({ help: true });
    expect(parseArgs(["-h"], CWD)).toEqual({ help: true });
  });

  it("throws when -o is followed by another flag", () => {
    expect(() => parseArgs(["-o", "--help"], CWD)).toThrow(/requires a value/);
  });

  it("throws when -o has no value", () => {
    expect(() => parseArgs(["-o"], CWD)).toThrow(/requires a value/);
  });

  it("throws when --output= has empty value", () => {
    expect(() => parseArgs(["--output="], CWD)).toThrow(/requires a value/);
  });

  it("throws on unknown flag", () => {
    expect(() => parseArgs(["--foo"], CWD)).toThrow(/Unknown flag/);
  });

  it("throws on multiple positional args", () => {
    expect(() => parseArgs(["a", "b"], CWD)).toThrow(/Too many positional/);
  });
});
