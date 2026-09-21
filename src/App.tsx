import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Schools } from "./pages/Schools";
import { PTAs } from "./pages/PTAs";
import { SchoolDetail } from "./pages/SchoolDetail";
import { PTADetail } from "./pages/PTADetail";
import { Sources } from "./pages/Sources";
import { About } from "./pages/About";
import VerticalTeams from "./pages/VerticalTeams";
import VerticalTeamDetail from "./pages/VerticalTeamDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/schools" element={<Schools />} />
          <Route path="/schools/:id" element={<SchoolDetail />} />
          <Route path="/ptas" element={<PTAs />} />
          <Route path="/ptas/:id" element={<PTADetail />} />
          <Route path="/sources" element={<Sources />} />
          <Route path="/about" element={<About />} />
          <Route path="/vertical-teams" element={<VerticalTeams />} />
          <Route path="/vertical-teams/:id" element={<VerticalTeamDetail />} />
          <Route
            path="/campuses"
            element={<Navigate to="/schools" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
