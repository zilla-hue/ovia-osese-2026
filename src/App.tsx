/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Programme from "./pages/Programme";
import PlanVisit from "./pages/PlanVisit";
import Sponsors from "./pages/Sponsors";
import News from "./pages/News";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Donate from "./pages/Donate";
import Volunteer from "./pages/Volunteer";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Admin — standalone layout (no public header/footer) */}
        <Route path="/admin" element={<Admin />} />

        {/* Public site */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="programme" element={<Programme />} />
          <Route path="visit" element={<PlanVisit />} />
          <Route path="sponsors" element={<Sponsors />} />
          <Route path="news" element={<News />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
          <Route path="register" element={<Register />} />
          <Route path="donate" element={<Donate />} />
          <Route path="volunteer" element={<Volunteer />} />
        </Route>
      </Routes>
    </Router>
  );
}
