import Sidebar from "../components/layout/Sidebar";

export default function Dashboard() {
  const user =
    localStorage.getItem("monazzimUser") || "User";

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <main className="dashboard-content">

        <h1>
          أهلاً {user}
        </h1>

        <div className="matrix">

          <div className="quadrant q1">
            مهم وعاجل
          </div>

          <div className="quadrant q2">
            مهم وغير عاجل
          </div>

          <div className="quadrant q3">
            غير مهم وعاجل
          </div>

          <div className="quadrant q4">
            غير مهم وغير عاجل
          </div>

        </div>

      </main>

    </div>
  );
}
