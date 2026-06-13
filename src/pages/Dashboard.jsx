import { useEffect, useState } from "react";
import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import { classifyTask } from "../services/ai";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("monazzim_user"));

    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text) => {
    const newTask = {
      id: Date.now(),
      text,
      type: classifyTask(text)
    };

    setTasks([...tasks, newTask]);
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const filter = (type) => tasks.filter(t => t.type === type);

  return (
    <div className="dashboard">

      <aside className="sidebar">
        <h2>Monazzim</h2>
      </aside>

      <main className="main">

        <h1>Welcome {name}</h1>

        <TaskInput addTask={addTask} />

        <div className="matrix">

          <div className="box red">
            <h3>Urgent & Important</h3>
            <TaskList tasks={filter("urgent-important")} removeTask={removeTask} />
          </div>

          <div className="box blue">
            <h3>Important</h3>
            <TaskList tasks={filter("important")} removeTask={removeTask} />
          </div>

          <div className="box yellow">
            <h3>Urgent</h3>
            <TaskList tasks={filter("urgent")} removeTask={removeTask} />
          </div>

          <div className="box gray">
            <h3>Low Priority</h3>
            <TaskList tasks={filter("low")} removeTask={removeTask} />
          </div>

        </div>

      </main>

    </div>
  );
}