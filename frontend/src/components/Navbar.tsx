import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "@css/components/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn] = useState(() => !!localStorage.getItem("token"));

  // Scroll to top whenever location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleScroll = useCallback(
    (id: string) => {
      if (location.pathname !== "/") {
        navigate("/", { replace: false });
        setTimeout(() => {
          const section = document.querySelector(id);
          if (section) section.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const section = document.querySelector(id);
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }
    },
    [location.pathname, navigate]
  );

  // Handle logo click - scroll to top if on homepage, otherwise navigate
  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  // Handle page navigation with instant scroll to top
  const handlePageNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault();

    // If we're already on the page, just scroll to top
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Navigate to the page
    navigate(path);
  };

  useEffect(() => {
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
  }, [handleScroll]);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-wrapper">
          <div
            className="logo"
            style={{ cursor: "pointer" }}
            onClick={handleLogoClick}
          >
            Finance<span className="logo-accent">U</span>
          </div>
          <ul className="nav-links">
            <li>
              <Link
                to="/curriculum"
                onClick={(e) => handlePageNavigation(e, "/curriculum")}
              >
                Curriculum
              </Link>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#pricing">Pricing</a>
            </li>
            <li>
              <Link
                to="/about"
                onClick={(e) => handlePageNavigation(e, "/about")}
              >
                About
              </Link>
            </li>
            <li id="authButtons">
              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  className="btn-primary"
                  onClick={(e) => handlePageNavigation(e, "/dashboard")}
                >
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
