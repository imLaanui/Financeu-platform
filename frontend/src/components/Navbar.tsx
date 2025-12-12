import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "@css/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn] = useState(() => !!localStorage.getItem("token"));

  const handleScroll = (id: string) => {
    if (location.pathname !== "/") {
      // If not on the homepage, navigate there first
      navigate("/", { replace: false });
      // Wait a tick so the DOM is ready, then scroll
      setTimeout(() => {
        const section = document.querySelector(id);
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } else {
      const section = document.querySelector(id);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Smooth scroll for in-page anchor links
    const handleSmoothScroll = (e: Event) => {
      const target = e.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        handleScroll(href);
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => link.addEventListener("click", handleSmoothScroll));

    return () => {
      links.forEach((link) =>
        link.removeEventListener("click", handleSmoothScroll)
      );
    };
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-wrapper">
          {/* Logo */}
          <div className="logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
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
