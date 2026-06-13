import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!name.trim()) return;

    localStorage.setItem("monazzim_user", name);
    navigate("/dashboard");
  };

  return (
    <div className="login">
      <div className="card">

        <h2>Welcome</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />

        <button onClick={handleLogin}>
          Continue
        </button>

      </div>
    </div>
  );
}