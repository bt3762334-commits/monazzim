import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <h2>Monazzim</h2>

      <nav>

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="#">
          Tasks
        </Link>

        <Link to="#">
          Analytics
        </Link>

        <Link to="#">
          Settings
        </Link>

      </nav>

    </aside>
  );
}
