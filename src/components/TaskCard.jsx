export default function TaskCard({ task, removeTask }) {
  return (
    <div className="task-card">
      <span>{task.text}</span>
      <button onClick={() => removeTask(task.id)}>❌</button>
    </div>
  );
}