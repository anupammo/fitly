"use client";

import { useEffect, useMemo, useState } from "react";
import { TOOL_DEFS, type Field } from "@/lib/toolDefs";

const todayIso = (offsetDays = 0) => new Date(Date.now() + offsetDays * 86_400_000).toISOString().slice(0, 10);

function initialValues(fields: Field[]) {
  const v: Record<string, string> = {};
  for (const f of fields) v[f.name] = f.type === "date" ? "" : f.default;
  return v;
}

function HeightInput({ id, value, onChange }: { id: string; value: string; onChange: (cm: string) => void }) {
  const [unit, setUnit] = useState<"cm" | "ft">("cm");
  // Feet and inches are kept as typed (strings) so clearing a box mid-edit doesn't reset the height.
  const [ft, setFt] = useState("");
  const [inch, setInch] = useState("");
  const toFtIn = (cmStr: string) => {
    const totalIn = Math.round((Number(cmStr) || 0) / 2.54);
    return [String(Math.floor(totalIn / 12)), String(totalIn % 12)];
  };
  const switchUnit = () => {
    if (unit === "cm") {
      const [f, i] = toFtIn(value);
      setFt(f);
      setInch(i);
    }
    setUnit(unit === "cm" ? "ft" : "cm");
  };
  const setFtIn = (f: string, i: string) => {
    setFt(f);
    setInch(i);
    const fn = Number(f);
    const inn = i === "" ? 0 : Number(i);
    onChange(f !== "" && fn >= 3 && fn <= 7 && inn >= 0 && inn < 12 ? String(Math.round((fn * 12 + inn) * 2.54 * 10) / 10) : "");
  };

  return (
    <div className="height-input">
      {unit === "cm" ? (
        <span className="with-unit">
          <input id={id} type="number" inputMode="decimal" min={90} max={230} value={value} onChange={(e) => onChange(e.target.value)} />
          <span className="unit">cm</span>
        </span>
      ) : (
        <>
          <span className="with-unit">
            <input id={id} type="number" inputMode="numeric" min={3} max={7} value={ft} onChange={(e) => setFtIn(e.target.value, inch)} aria-label="Feet" />
            <span className="unit">ft</span>
          </span>
          <span className="with-unit">
            <input type="number" inputMode="numeric" min={0} max={11} value={inch} onChange={(e) => setFtIn(ft, e.target.value)} aria-label="Inches" />
            <span className="unit">in</span>
          </span>
        </>
      )}
      <button type="button" className="link-button" onClick={switchUnit}>
        Use {unit === "cm" ? "feet/inches" : "cm"}
      </button>
    </div>
  );
}

function isValid(fields: Field[], v: Record<string, string>) {
  return fields.every((f) => {
    if (f.type === "checkbox" || f.type === "select") return true;
    if (!v[f.name]) return false;
    if (f.type === "number") {
      const x = Number(v[f.name]);
      return Number.isFinite(x) && x >= f.min && x <= f.max;
    }
    if (f.type === "height") {
      const x = Number(v[f.name]);
      return x >= 90 && x <= 230;
    }
    return true;
  });
}

export default function ToolRunner({ slug }: { slug: string }) {
  const def = TOOL_DEFS[slug];
  const [values, setValues] = useState(() => initialValues(def.fields));

  // Date defaults depend on "today", so set them on the client to avoid a hydration mismatch.
  useEffect(() => {
    setValues((prev) => {
      const next = { ...prev };
      for (const f of def.fields) if (f.type === "date" && !next[f.name]) next[f.name] = todayIso(f.default === "minus14" ? -14 : 0);
      return next;
    });
  }, [def.fields]);

  const set = (name: string, value: string) => setValues((p) => ({ ...p, [name]: value }));
  const valid = isValid(def.fields, values);
  const result = useMemo(() => (valid ? def.compute(values) : null), [def, values, valid]);

  return (
    <div className="tool">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        {def.fields.map((f) => {
          const id = `${slug}-${f.name}`;
          if (f.type === "checkbox")
            return (
              <label key={f.name} className="check">
                <input type="checkbox" checked={values[f.name] === "on"} onChange={(e) => set(f.name, e.target.checked ? "on" : "")} />
                {f.label}
              </label>
            );
          return (
            <div key={f.name} className="field">
              <label htmlFor={id}>{f.label}</label>
              {f.type === "select" ? (
                <select id={id} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)}>
                  {f.options.map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>
              ) : f.type === "height" ? (
                <HeightInput id={id} value={values[f.name]} onChange={(cm) => set(f.name, cm)} />
              ) : f.type === "number" ? (
                <span className="with-unit">
                  <input
                    id={id}
                    type="number"
                    inputMode="decimal"
                    min={f.min}
                    max={f.max}
                    step={f.step ?? 1}
                    value={values[f.name]}
                    onChange={(e) => set(f.name, e.target.value)}
                  />
                  {f.unit && <span className="unit">{f.unit}</span>}
                </span>
              ) : (
                <input id={id} type={f.type} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} />
              )}
            </div>
          );
        })}
      </form>

      <section className={`result tone-${result?.tone ?? "neutral"}`} aria-live="polite">
        {result ? (
          <>
            <p className="result-headline">{result.headline}</p>
            {result.sub && <p className="result-sub">{result.sub}</p>}
            {result.rows && (
              <table className="result-rows">
                <tbody>
                  {result.rows.map(([k, val]) => (
                    <tr key={k}>
                      <th scope="row">{k}</th>
                      <td>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {result.note && <p className="result-note">{result.note}</p>}
          </>
        ) : (
          <p className="result-sub">Enter your details to see the result.</p>
        )}
      </section>
    </div>
  );
}
