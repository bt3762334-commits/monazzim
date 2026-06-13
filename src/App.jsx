import { useState, useEffect } from "react";
import EisenhowerMatrix from "./components/EisenhowerMatrix";
import PomodoroTimer from "./components/PomodoroTimer";
import AICoach from "./components/AICoach";
import Analytics from "./components/Analytics";
import Streaks from "./components/Streaks";
import DailyReflection from "./components/DailyReflection";
import DailyQuote from "./components/DailyQuote";
import D3Background from "./components/D3Background";

const NAV = [
  { id: "matrix",     icon: "⊞",  label: "المصفوفة" },
  { id: "pomodoro",   icon: "⏱",  label: "بومودورو" },
  { id: "coach",      icon: "🤖",  label: "AI Coach" },
  { id: "analytics",  icon: "📊",  label: "تحليلات" },
  { id: "streaks",    icon: "🔥",  label: "الإنجازات" },
  { id: "reflection", icon: "📝",  label: "تأمل يومي" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("matrix");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("monazzim_tasks_v2");
    return saved ? JSON.parse(saved) : {
      q1: [{ id: 1, text: "إصلاح بق حرج في الموقع", done: false, created: Date.now() }],
      q2: [{ id: 2, text: "تعلّم React Advanced Patterns", done: false, created: Date.now() }],
      q3: [{ id: 3, text: "الرد على إيميلات غير ضرورية", done: false, created: Date.now() }],
      q4: [{ id: 4, text: "تصفح السوشيال ميديا", done: false, created: Date.now() }],
    };
  });

  const [streak, setStreak] = useState(() => {
    const s = localStorage.getItem("monazzim_streak");
    return s ? JSON.parse(s) : { count: 0, lastDate: null, badges: [] };
  });

  const [completedToday, setCompletedToday] = useState(() => {
    const d = localStorage.getItem("monazzim_completed_today");
    const today = new Date().toDateString();
    const saved = d ? JSON.parse(d) : { date: today, count: 0 };
    if (saved.date !== today) return { date: today, count: 0 };
    return saved;
  });

  useEffect(() => {
    localStorage.setItem("monazzim_tasks_v2", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("monazzim_streak", JSON.stringify(streak));
  }, [streak]);

  useEffect(() => {
    localStorage.setItem("monazzim_completed_today", JSON.stringify(completedToday));
  }, [completedToday]);

  function handleTaskDone(q, id) {
    setTasks(prev => {
      const updated = { ...prev };
      updated[q] = updated[q].map(t => {
        if (t.id === id) {
          const nowDone = !t.done;
          if (nowDone) {
            setCompletedToday(c => ({ ...c, count: c.count + 1 }));
            updateStreak();
          } else {
            setCompletedToday(c => ({ ...c, count: Math.max(0, c.count - 1) }));
          }
          return { ...t, done: nowDone };
        }
        return t;
      });
      return updated;
    });
  }

  function updateStreak() {
    const today = new Date().toDateString();
    setStreak(prev => {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (prev.lastDate === today) return prev;
      const newCount = prev.lastDate === yesterday ? prev.count + 1 : 1;
      const badges = [...prev.badges];
      if (newCount === 3 && !badges.includes("3days")) badges.push("3days");
      if (newCount === 7 && !badges.includes("week")) badges.push("week");
      if (newCount === 30 && !badges.includes("month")) badges.push("month");
      return { count: newCount, lastDate: today, badges };
    });
  }

  function handleAddTask(q, text) {
    setTasks(prev => ({
      ...prev,
      [q]: [...prev[q], { id: Date.now(), text, done: false, created: Date.now() }],
    }));
  }

  function handleDeleteTask(q, id) {
    setTasks(prev => ({ ...prev, [q]: prev[q].filter(t => t.id !== id) }));
  }

  const allTasks = Object.values(tasks).flat();
  const doneCount = allTasks.filter(t => t.done).length;
  const totalCount = allTasks.length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-background-tertiary)", position: "relative", fontFamily: "var(--font-sans)" }}>
      <D3Background />

      {/* Header */}
      <header style={{ position: "relative", zIndex: 10, background: "rgba(var(--bg-rgb,255,255,255),0.85)", backdropFilter: "blur(12px)", borderBottom: "0.5px solid var(--color-border-tertiary)", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#7F77DD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⊞</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.1 }}>منظّم</div>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>AI Productivity OS</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <DailyQuote compact />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[
                { label: "🔥", value: streak.count + " يوم" },
                { label: "✅", value: doneCount + "/" + totalCount },
                { label: "⚡", value: completedToday.count + " اليوم" },
              ].map((s, i) => (
                <span key={i} style={{ background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 20, padding: "3px 10px", fontSize: 12, color: "var(--color-text-secondary)" }}>
                  {s.label} <strong style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{s.value}</strong>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", gap: 2, paddingBottom: 0 }}>
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => setActiveTab(n.id)}
              style={{
                padding: "8px 14px", border: "none", background: "transparent", cursor: "pointer",
                fontSize: 13, fontFamily: "var(--font-sans)", fontWeight: activeTab === n.id ? 500 : 400,
                color: activeTab === n.id ? "#7F77DD" : "var(--color-text-secondary)",
                borderBottom: activeTab === n.id ? "2px solid #7F77DD" : "2px solid transparent",
                transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5,
              }}
            >
              <span>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main style={{ position: "relative", zIndex: 1, padding: "1.5rem", maxWidth: 1200, margin: "0 auto" }}>
        {activeTab === "matrix" && (
          <EisenhowerMatrix tasks={tasks} onDone={handleTaskDone} onAdd={handleAddTask} onDelete={handleDeleteTask} />
        )}
        {activeTab === "pomodoro" && <PomodoroTimer tasks={allTasks.filter(t => !t.done)} onComplete={updateStreak} />}
        {activeTab === "coach" && <AICoach tasks={tasks} streak={streak} completedToday={completedToday} />}
        {activeTab === "analytics" && <Analytics tasks={tasks} streak={streak} completedToday={completedToday} />}
        {activeTab === "streaks" && <Streaks streak={streak} completedToday={completedToday} total={totalCount} done={doneCount} />}
        {activeTab === "reflection" && <DailyReflection streak={streak} completedToday={completedToday} tasks={allTasks} />}
      </main>
    </div>
  );
}