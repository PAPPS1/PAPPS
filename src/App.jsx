import "./index.css";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./Components/Navbar";
import PageWrapper from "./Components/Pages/PageWrapper"; // <-- Your motion wrapper

import Home from "./Components/Pages/Home";
import About from "./Components/Pages/About";
import Blog from "./Components/Pages/Blog";
import MemberShipRoaster from "./Components/Pages/MemberShipRoaster";
import Events from "./Components/Pages/Events";

import AdminLogin from "./Components/AdminLogin";
import ProtectedRoute from "./Components/ProtectedRoute";
import MembersData from "./Components/MembersData";
import EditNews from "./Components/EditNews";

import AboutHistory from "./Components/Pages/SubPages/AboutHistory";
import AboutFounder from "./Components/Pages/SubPages/AboutFounder";
import AboutObjectives from "./Components/Pages/SubPages/AboutObjectives";
import AboutOrganization from "./Components/Pages/SubPages/AboutOrganization";
import StudyCorner from "./Components/Pages/SubPages/StudyCorner";
import CoursesTrainings from "./Components/Pages/SubPages/CoursesTrainings";
import CertificateGenerator from "./Components/CertificateGenerator";

function AnimatedRoutes({ auth, setAuth }) {
  const location = useLocation(); // needed for AnimatePresence

  return (
    <AnimatePresence mode="wait">
      <Routes key={location.pathname} location={location}>
        {/* ROOT */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* PUBLIC ROUTES */}
        <Route
          path="/home"
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          }
        />

        <Route
          path="/about"
          element={
            <PageWrapper>
              <About />
            </PageWrapper>
          }
        >
          <Route
            index
            element={
              <PageWrapper>
                <AboutHistory />
              </PageWrapper>
            }
          />
          <Route
            path="history"
            element={
              <PageWrapper>
                <AboutHistory />
              </PageWrapper>
            }
          />
          <Route
            path="founder"
            element={
              <PageWrapper>
                <AboutFounder />
              </PageWrapper>
            }
          />
          <Route
            path="objectives"
            element={
              <PageWrapper>
                <AboutObjectives />
              </PageWrapper>
            }
          />
          <Route
            path="organization"
            element={
              <PageWrapper>
                <AboutOrganization />
              </PageWrapper>
            }
          />
        </Route>
        <Route
          path="/blog"
          element={
            <PageWrapper>
              <Blog />
            </PageWrapper>
          }
        />
        <Route
          path="/events"
          element={
            <PageWrapper>
              <Events auth={auth} />
            </PageWrapper>
          }
        />
        <Route
          path="/membership"
          element={
            <PageWrapper>
              <MemberShipRoaster />
            </PageWrapper>
          }
        />
        <Route
          path="/studycorner"
          element={
            <PageWrapper>
              <StudyCorner />
            </PageWrapper>
          }
        />
        <Route
          path="/coursesandtrainings"
          element={
            <PageWrapper>
              <CoursesTrainings />
            </PageWrapper>
          }
        />

        <Route
          path="/certificates"
          element={
            <PageWrapper>
              <CertificateGenerator />
            </PageWrapper>
          }
        />

        {/* ADMIN LOGIN */}
        <Route
          path="/admin/login"
          element={
            <PageWrapper>
              <AdminLogin setAuth={setAuth} />
            </PageWrapper>
          }
        />

        {/* ADMIN ONLY */}
        <Route
          path="/editnews"
          element={
            <ProtectedRoute allowedRoles={["admin", "senior_admin"]}>
              <PageWrapper>
                <EditNews />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/membersdata"
          element={
            <ProtectedRoute requireSenior={true}>
              <PageWrapper>
                <MembersData />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [auth, setAuth] = useState(() => {
    return JSON.parse(localStorage.getItem("papps_auth")) || null;
  });

  return (
    <div className="md:px-10 lg:px-15">
      <Router>
        <Navbar setAuth={setAuth} />
        <AnimatedRoutes auth={auth} setAuth={setAuth} />
      </Router>
    </div>
  );
}

export default App;
