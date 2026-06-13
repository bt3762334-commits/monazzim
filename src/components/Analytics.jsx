import { PieChart, Pie, Cell } from "recharts";

export default function Analytics({ tasks }) {

  const data = [
    { name: "Urgent Important", value: tasks.filter(t => t.type === "urgent-important").length },
    { name: "Important", value: tasks.filter(t => t.type === "important").length },
    { name: "Urgent", value: tasks.filter(t => t.type === "urgent").length },
    { name: "Low", value: tasks.filter(t => t.type === "low").length },
  ];

  const COLORS = ["#dc2626", "#2563eb", "#f59e0b", "#374151"];

  return (
    <div>
      <h3>Analytics</h3>

      <PieChart width={300} height={300}>
        <Pie data={data} dataKey="value" outerRadius={100}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}