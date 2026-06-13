import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!name.trim()) return;

    localStorage.setItem("monazzimUser", name);

    navigate("/dashboard");
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>مرحبًا بك</h1>

        <p>اكتب اسمك للبدء</p>

        <input
          type="text"
          placeholder="اسمك"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={handleSubmit}>
          دخول
        </button>

      </div>

    </div>
  );
}
