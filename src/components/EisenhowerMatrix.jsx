import { useState } from "react";

const QUADRANTS = [
  { key: "q1", label: "Q1 · افعلها الآن", title: "عاجل ومهم", icon: "🔥", color: "#7F77DD", light: "#EEEDFE", dark: "#3C3489", tip: "ركّز عليها فوراً" },
  { key: "q2", label: "Q2 · خطّط ليها",   title: "مهم مش عاجل", icon: "📅", color: "#1D9E75", light: "#E1F5EE", dark: "#0F6E56", tip: "اجدوللها وقت" },
  { key: "q3", label: "Q3 · فوّضها",       title: "عاجل مش مهم", icon: "🤝", color: "#BA7517", light: "#FAEEDA", dark: "#854F0B", tip: "حاول تفوّضها لحد تاني" },
  { key: "q4", label: "Q4 · احذفها",       title: "مش عاجل ومش مهم", icon: "🗑", color: "#888780", light: "#F1EFE8", dark: "#5F5E5A", tip: "استغنّ عنها" },
];

export default function EisenhowerMatrix({ tasks, onDone, onAdd, onDelete }) {
  const [inputs, setInputs] = useState({ q1: "", q2: "", q3: "", q4: "" });

  function handleAdd(q) {
    const val = inputs[q].trim();
    if (!val) return;
    onAdd(q, val);
    setInputs(p => ({ ...p, [q]: "" }));
  }

  const allTasks = Object.values(tasks).flat();
  const doneCount = allTasks.filter(t => t.done).length;
  const total = allTasks.length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div>
      {/* Progress bar */}
      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>إنجاز اليوم</span>
        <div style={{ flex: 1, height: 6, background: "var(--color-background-secondary)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg, #7F77DD, #1D9E75)", borderRadius: 4, transition: "width 0.4s ease" }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: "#1D9E75", minWidth: 36, textAlign: "right" }}>{pct}%</span>
        <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{doneCount} / {total} مهمة</span>
      </div>

      {/* Axis labels */}
      <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 1fr", gridTemplateRows: "auto auto", gap: 0 }}>
        <div style={{ gridColumn: "2", textAlign: "center", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", padding: "4px 0 8px", borderBottom: "2px solid var(--color-border-tertiary)", borderRight: "0.5px solid var(--color-border-tertiary)" }}>⚡ عاجل</div>
        <div style={{ gridColumn: "3", textAlign: "center", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", padding: "4px 0 8px", borderBottom: "2px solid var(--color-border-tertiary)" }}>🕒 مش عاجل</div>

        <div style={{ gridColumn: "1", gridRow: "2/4", display: "flex", alignItems: "center", justifyContent: "center", writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", borderRight: "2px solid var(--color-border-tertiary)", padding: "0 6px 0 0" }}>
          ⭐ مهم &nbsp;&nbsp;&nbsp;&nbsp; 💤 مش مهم
        </div>

        <div style={{ gridColumn: "2/-1", gridRow: "2", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 10, paddingTop: 10, paddingLeft: 10, minHeight: 460 }}>
          {QUADRANTS.map(q => (
            <Quadrant
              key={q.key} q={q}
              tasks={tasks[q.key] || []}
              input={inputs[q.key]}
              onInputChange={v => setInputs(p => ({ ...p, [q.key]: v }))}
              onAdd={() => handleAdd(q.key)}
              onDone={id => onDone(q.key, id)}
              onDelete={id => onDelete(q.key, id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Quadrant({ q, tasks, input, onInputChange, onAdd, onDone, onDelete }) {
  const done = tasks.filter(t => t.done).length;
  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: 12, padding: 12,
      display: "flex", flexDirection: "column", gap: 8,
      position: "relative", overflow: "hidden",
    }}>
      {/* color strip */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: q.color, borderRadius: "12px 12px 0 0" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <span style={{ background: q.light, color: q.dark, fontSize: 10, fontWeight: 500, padding: "3px 8px", borderRadius: 20 }}>{q.label}</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: q.dark, flex: 1 }}>{q.icon} {q.title}</span>
        <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{done}/{tasks.length}</span>
      </div>

      <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: 0, fontStyle: "italic" }}>{q.tip}</p>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4, maxHeight: 180 }}>
        {tasks.length === 0 && (
          <div style={{ textAlign: "center", padding: "20px 0", color: "var(--color-text-secondary)", fontSize: 12 }}>لا توجد مهام</div>
        )}
        {tasks.map(t => (
          <div
            key={t.id}
            style={{
              display: "flex", alignItems: "flex-start", gap: 7,
              padding: "6px 8px", borderRadius: 8,
              background: "var(--color-background-secondary)",
              border: "0.5px solid var(--color-border-tertiary)",
              opacity: t.done ? 0.55 : 1, transition: "opacity 0.2s",
            }}
          >
            <button
              onClick={() => onDone(t.id)}
              aria-label="تأشير كمكتملة"
              style={{
                width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 1, cursor: "pointer",
                border: t.done ? "none" : `1.5px solid ${q.color}`,
                background: t.done ? q.color : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, color: "#fff", transition: "all 0.15s",
              }}
            >{t.done ? "✓" : ""}</button>
            <span style={{ flex: 1, fontSize: 12, lineHeight: 1.45, textDecoration: t.done ? "line-through" : "none", color: t.done ? "var(--color-text-secondary)" : "var(--color-text-primary)" }}>{t.text}</span>
            <button
              onClick={() => onDelete(t.id)}
              aria-label="حذف المهمة"
              style={{ fontSize: 14, color: "var(--color-text-secondary)", background: "none", border: "none", cursor: "pointer", padding: "0 2px", opacity: 0.5, lineHeight: 1 }}
            >×</button>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 5 }}>
        <input
          value={input}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onAdd()}
          placeholder="مهمة جديدة..."
          style={{
            flex: 1, padding: "6px 10px", border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: 8, background: "var(--color-background-secondary)",
            fontSize: 12, color: "var(--color-text-primary)", fontFamily: "var(--font-sans)", outline: "none",
          }}
        />
        <button
          onClick={onAdd}
          style={{
            padding: "6px 12px", borderRadius: 8, border: "none",
            background: q.light, color: q.dark,
            fontSize: 16, cursor: "pointer", fontWeight: 500, lineHeight: 1,
          }}
        >+</button>
      </div>
    </div>
  );
}