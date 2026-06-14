import { useState, useEffect } from "react";

const PROMPTS = [
  "إيه أهم حاجة عملتها النهارده؟",
  "إيه اللي ممكن تعمله بشكل أحسن بكره؟",
  "إيه أكتر حاجة شايل بالك منها دلوقتي؟",
  "على مقياس من 1 لـ 10، إيه مستوى طاقتك النهارده ولية؟",
  "إيه الدرس اللي اتعلمته النهارده؟",
];

export default function DailyReflection({ streak, completedToday, tasks }) {
  const today = new Date().toDateString();
  const [reflections, setReflections] = useState(() => {
    const s = localStorage.getItem("monazzim_reflections");
    return s ? JSON.parse(s) : {};
  });
  const [answers, setAnswers] = useState(reflections[today]?.answers || {});
  const [mood, setMood] = useState(reflections[today]?.mood || null);
  const [saved, setSaved] = useState(!!reflections[today]);
  const [aiInsight, setAiInsight] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  function save() {
    const entry = { answers, mood, date: today, completedToday: completedToday.count };
    const updated = { ...reflections, [today]: entry };
    setReflections(updated);
    localStorage.setItem("monazzim_reflections", JSON.stringify(updated));
    setSaved(true);
  }

  async function getAIInsight() {
    setLoadingAI(true);
    const doneTasks = Object.values(tasks).flat().filter(t=>t.done).map(t=>t.text).join(", ");
    const answersText = PROMPTS.map((p,i)=>`س: ${p}\nج: ${answers[i]||"لم يُجَب"}`).join("\n");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 1000,
          system: "أنت مدرب إنتاجية ورفاهية. قدّم تحليلاً قصيراً ومشجّعاً بالعربي المصري (5-7 جمل).",
          messages: [{ role: "user", content: `مراجعة اليوم:\nالمزاج: ${mood || "غير محدد"}\nالمهام المكتملة: ${doneTasks || "لا شيء"}\n\nإجابات التأمل:\n${answersText}\n\nقدّم تحليلاً وتوصية للغد.` }]
        })
      });
      const data = await res.json();
      setAiInsight(data.content?.map(b=>b.text||"").join("")||"");
    } catch { setAiInsight("تعذّر تحميل التحليل، حاول لاحقاً."); }
    setLoadingAI(false);
  }

  const MOODS = ["😫","😔","😐","😊","🤩"];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 500, margin: "0 0 4px" }}>📝 تأمل يومي</h3>
          <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 16px" }}>{new Date().toLocaleDateString("ar-EG", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}</p>

          {/* Mood */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 10 }}>كيف مزاجك النهارده؟</label>
            <div style={{ display: "flex", gap: 12 }}>
              {MOODS.map((m, i) => (
                <button key={i} onClick={() => setMood(i)}
                  style={{ fontSize: 28, background: mood === i ? "#EEEDFE" : "var(--color-background-secondary)", border: `2px solid ${mood===i?"#7F77DD":"var(--color-border-tertiary)"}`, borderRadius: 12, padding: "8px 10px", cursor: "pointer", transition: "all 0.2s" }}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Questions */}
          {PROMPTS.map((p, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>{p}</label>
              <textarea
                value={answers[i] || ""}
                onChange={e => setAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                rows={2}
                placeholder="اكتب إجابتك هنا..."
                style={{ width: "100%", padding: "8px 12px", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 8, background: "var(--color-background-secondary)", color: "var(--color-text-primary)", fontSize: 13, fontFamily: "var(--font-sans)", outline: "none", resize: "vertical", lineHeight: 1.6 }}
              />
            </div>
          ))}

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={save} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: "#7F77DD", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
              {saved ? "✅ تم الحفظ" : "💾 حفظ التأمل"}
            </button>
            <button onClick={getAIInsight} disabled={loadingAI} style={{ padding: "10px 16px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", fontSize: 14, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
              {loadingAI ? "⏳" : "🤖 تحليل AI"}
            </button>
          </div>
        </div>

        {aiInsight && (
          <div style={{ background: "#EEEDFE", border: "0.5px solid #7F77DD40", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#3C3489", marginBottom: 8 }}>🤖 تحليل AI لتأملك</div>
            <p style={{ fontSize: 13, color: "#3C3489", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{aiInsight}</p>
          </div>
        )}
      </div>

      {/* History */}
      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 16, padding: 20 }}>
        <h3 style={{ fontSize: 13, fontWeight: 500, margin: "0 0 12px" }}>📅 تأملات سابقة</h3>
        {Object.keys(reflections).length === 0 ? (
          <p style={{ fontSize: 12, color: "var(--color-text-secondary)", textAlign: "center", padding: "20px 0" }}>ما في تأملات بعد.<br/>ابدأ النهارده! 🌟</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 480, overflowY: "auto" }}>
            {Object.entries(reflections).sort((a,b)=>new Date(b[0])-new Date(a[0])).map(([date,r]) => (
              <div key={date} style={{ padding: "10px 12px", background: "var(--color-background-secondary)", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{new Date(date).toLocaleDateString("ar-EG")}</span>
                  <span style={{ fontSize: 16 }}>{["😫","😔","😐","😊","🤩"][r.mood] || "—"}</span>
                </div>
                <div style={{ fontSize: 12 }}>✅ {r.completedToday || 0} مهام مكتملة</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );