import { describe, expect, it } from "vitest";
import { TOOLS } from "./tools";
import { TOOL_DEFS } from "./toolDefs";

describe("tool definitions", () => {
  it("every tool page has a definition, and every definition has a page", () => {
    expect(Object.keys(TOOL_DEFS).sort()).toEqual(TOOLS.map((t) => t.slug).sort());
  });

  it.each(TOOLS.map((t) => t.slug))("%s computes a result from its defaults", (slug) => {
    const def = TOOL_DEFS[slug];
    const v: Record<string, string> = {};
    for (const f of def.fields) v[f.name] = f.type === "date" ? "2026-01-01" : f.default;
    const r = def.compute(v);
    expect(r.headline).toBeTruthy();
    expect(r.headline).not.toMatch(/NaN|undefined/);
    for (const [, val] of r.rows ?? []) expect(val).not.toMatch(/NaN|undefined/);
  });
});
