import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Help from "./pages/Help";
import Terms from "./pages/Terms";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import Privacy from "./pages/Privacy";
import ForgotPassword from "./pages/ForgotPassword";
import Curriculum from "./pages/Curriculum";
import Feedback from "./pages/Feedback";
import AdminFeedback from "./pages/AdminFeedback";
import AdminUsers from "./pages/AdminUsers";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/careers", element: <Careers /> },
  { path: "/help", element: <Help /> },
  { path: "/terms", element: <Terms /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/privacy", element: <Privacy /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/curriculum", element: <Curriculum /> },
  { path: "/feedback", element: <Feedback /> },
  { path: "/admin/feedback", element: <AdminFeedback /> },
  { path: "/admin/users", element: <AdminUsers /> },
];

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  </BrowserRouter>
);
