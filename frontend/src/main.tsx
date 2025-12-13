import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Help from "./pages/Help";
import Terms from "./pages/Terms";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ResetPassword from "./pages/auth/ResetPassword";
import Privacy from "./pages/Privacy";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Curriculum from "./pages/Curriculum";
import Feedback from "./pages/Feedback";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminUsers from "./pages/admin/AdminUsers";
import Dashboard from "./pages/Dashboard";

import Pillar1Index from "./pages/pillars/pillar1/Index";
import Lesson1 from "./pages/pillars/pillar1/Lesson1";
import Lesson2 from "./pages/pillars/pillar1/Lesson2";
import Lesson3 from "./pages/pillars/pillar1/Lesson3";
import Lesson4 from "./pages/pillars/pillar1/Lesson4";
import Lesson5 from "./pages/pillars/pillar1/Lesson5";
import Lesson6 from "./pages/pillars/pillar1/Lesson6";
import Lesson7 from "./pages/pillars/pillar1/Lesson7";
import Lesson8 from "./pages/pillars/pillar1/Lesson8";
import Pillar1Quiz from "./pages/pillars/pillar1/Quiz";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      {/* Top-level routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/help" element={<Help />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/curriculum" element={<Curriculum />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/admin/feedback" element={<AdminFeedback />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Pillar1 routes – flat */}
      <Route path="/pillar1" element={<Pillar1Index />} />
      <Route path="/pillar1/lesson1" element={<Lesson1 />} />
      <Route path="/pillar1/lesson2" element={<Lesson2 />} />
      <Route path="/pillar1/lesson3" element={<Lesson3 />} />
      <Route path="/pillar1/lesson4" element={<Lesson4 />} />
      <Route path="/pillar1/lesson5" element={<Lesson5 />} />
      <Route path="/pillar1/lesson6" element={<Lesson6 />} />
      <Route path="/pillar1/lesson7" element={<Lesson7 />} />
      <Route path="/pillar1/lesson8" element={<Lesson8 />} />
      <Route path="/pillar1/quiz" element={<Pillar1Quiz />} />
    </Routes>
  </BrowserRouter>
);
