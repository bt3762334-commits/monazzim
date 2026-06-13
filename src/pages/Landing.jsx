import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="landing">

      <nav className="navbar">

        <h2>مُنظم</h2>

        <Link className="btn" to="/login">
          ابدأ الآن
        </Link>

      </nav>

      <section className="hero">

        <h1>
          نظم يومك بطريقة أذكى
        </h1>

        <p>
          إدارة المهام، مصفوفة أيزنهاور،
          التركيز، الإنجاز والتحليل في مكان واحد.
        </p>

        <Link className="hero-btn" to="/login">
          ابدأ مجانًا
        </Link>

      </section>

    </div>
  );
}
