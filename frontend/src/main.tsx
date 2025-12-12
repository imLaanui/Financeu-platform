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
import Dashboard from "./pages/Dashboard";
import Lesson1 from "./pages/Pillars/Pillar1/Lesson1";
import Lesson2 from "./pages/Pillars/Pillar1/Lesson2";
import Lesson3 from "./pages/Pillars/Pillar1/Lesson3";
import Lesson4 from "./pages/Pillars/Pillar1/Lesson4";
import Lesson5 from "./pages/Pillars/Pillar1/Lesson5";
import Lesson6 from "./pages/Pillars/Pillar1/Lesson6";
import Lesson7 from "./pages/Pillars/Pillar1/Lesson7";
import Lesson8 from "./pages/Pillars/Pillar1/Lesson8";
import Pillar1Index from "./pages/Pillars/Pillar1/Index";
import Pillar1Quiz from "./pages/Pillars/Pillar1/Quiz";

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
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/pillar1-lessons", element: <Pillar1Index /> },
  { path: "/pillar-lesson1", element: <Lesson1 /> },
  { path: "/pillar-lesson2", element: <Lesson2 /> },
  { path: "/pillar-lesson3", element: <Lesson3 /> },
  { path: "/pillar-lesson4", element: <Lesson4 /> },
  { path: "/pillar-lesson5", element: <Lesson5 /> },
  { path: "/pillar-lesson6", element: <Lesson6 /> },
  { path: "/pillar-lesson7", element: <Lesson7 /> },
  { path: "/pillar-lesson8", element: <Lesson8 /> },
  { path: "/pillar1-quiz", element: <Pillar1Quiz /> },
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
