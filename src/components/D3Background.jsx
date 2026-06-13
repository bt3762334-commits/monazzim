import { useEffect, useRef } from "react";

export default function D3Background() {
  const svgRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const COLORS = isDark
      ? ["rgba(127,119,221,0.13)", "rgba(29,158,117,0.1)", "rgba(186,117,23,0.08)", "rgba(216,90,48,0.07)"]
      : ["rgba(127,119,221,0.08)", "rgba(29,158,117,0.06)", "rgba(186,117,23,0.05)", "rgba(216,90,48,0.04)"];

    function resize() {
      const w = window.innerWidth;
      const h = document.documentElement.scrollHeight;
      svg.setAttribute("width", w);
      svg.setAttribute("height", h);
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    }
    resize();
    window.addEventListener("resize", resize);

    const ns = "http://www.w3.org/2000/svg";
    const nodes = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 50 + Math.random() * 120,
      c: COLORS[i % COLORS.length],
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));

    // Grid lines
    const grid = document.createElementNS(ns, "g");
    grid.setAttribute("opacity", isDark ? "0.05" : "0.035");
    const W = window.innerWidth, H = window.innerHeight * 3;
    for (let x = 0; x < W; x += 44) {
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", x); line.setAttribute("y1", 0);
      line.setAttribute("x2", x); line.setAttribute("y2", H);
      line.setAttribute("stroke", isDark ? "#ffffff" : "#000000");
      line.setAttribute("stroke-width", "0.5");
      grid.appendChild(line);
    }
    for (let y = 0; y < H; y += 44) {
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", 0); line.setAttribute("y1", y);
      line.setAttribute("x2", W); line.setAttribute("y2", y);
      line.setAttribute("stroke", isDark ? "#ffffff" : "#000000");
      line.setAttribute("stroke-width", "0.5");
      grid.appendChild(line);
    }
    svg.appendChild(grid);

    // Blobs
    const circles = nodes.map(node => {
      const c = document.createElementNS(ns, "circle");
      c.setAttribute("cx", node.x);
      c.setAttribute("cy", node.y);
      c.setAttribute("r", node.r);
      c.setAttribute("fill", node.c);
      c.style.filter = "blur(20px)";
      svg.appendChild(c);
      return c;
    });

    function tick() {
      const W = window.innerWidth;
      const H = window.innerHeight;
      nodes.forEach((n, i) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < -n.r || n.x > W + n.r) n.vx *= -1;
        if (n.y < -n.r || n.y > H + n.r) n.vy *= -1;
        circles[i].setAttribute("cx", n.x);
        circles[i].setAttribute("cy", n.y);
      });
      animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      while (svg.firstChild) svg.removeChild(svg.firstChild);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0,
      }}
    />
  );
}