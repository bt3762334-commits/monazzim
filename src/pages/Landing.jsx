import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="landing">

      <nav className="nav">
        <h2>Monazzim</h2>
        <Link to="/login" className="btn">Start</Link>
      </nav>

      <div className="hero">
        <h1>Monazzim</h1>
        <p>AI Productivity OS + Eisenhower Matrix</p>

        <Link to="/login" className="btn-primary">
          Get Started
        </Link>
      </div>

    </div>
  );
}