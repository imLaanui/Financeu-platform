import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "@css/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  // Initialize state from localStorage without causing effect re-render
  const [isLoggedIn] = useState(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });

  useEffect(() => {
    const handleSmoothScroll = (e: Event) => {
      const target = e.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const section = document.querySelector(href);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => link.addEventListener("click", handleSmoothScroll));

    return () => {
      links.forEach(link => link.removeEventListener("click", handleSmoothScroll));
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-wrapper">
          {/* Logo */}
          <div
            className="logo"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Finance<span className="logo-accent">U</span>
          </div>

          <ul className="nav-links">
            <li>
              <Link to="/curriculum">Curriculum</Link>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#pricing">Pricing</a>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li id="authButtons">
              {isLoggedIn ? (
                <Link to="/dashboard" className="btn-primary">
                  Dashboard
                </Link>
              ) : (
                <Link to="/login" className="btn-primary">
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
