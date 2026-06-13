import TaskCard from "./TaskCard";

export default function TaskList({ tasks, removeTask }) {
  return (
    <>
      {tasks.map((t) => (
        <TaskCard key={t.id} task={t} removeTask={removeTask} />
      ))}
    </>
  );
}