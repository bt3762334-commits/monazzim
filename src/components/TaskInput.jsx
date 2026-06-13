import { useState } from "react";

export default function TaskInput({ addTask }) {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (!text.trim()) return;

    addTask(text);
    setText("");
  };

  return (
    <div className="task-input">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add task..."
      />

      <button onClick={handleAdd}>Add</button>
    </div>
  );
}