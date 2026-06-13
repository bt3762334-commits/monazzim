import { useState } from "react";

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const fakeAI = (text) => {
    if (text.includes("plan")) {
      return "Focus on your Important tasks first, then Urgent ones.";
    }
    if (text.includes("stress")) {
      return "Take a short break and use Pomodoro technique.";
    }
    return "Keep going — break tasks into smaller steps.";
  };

  const send = () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    const aiMsg = { role: "ai", text: fakeAI(input) };

    setMessages([...messages, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <div className="ai-box">

      <h3>AI Coach</h3>

      <div className="chat">
        {messages.map((m, i) => (
          <div key={i} className={m.role}>
            {m.text}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask AI..."
      />

      <button onClick={send}>Send</button>

    </div>
  );
}