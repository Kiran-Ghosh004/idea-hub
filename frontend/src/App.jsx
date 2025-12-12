import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import SinglePost from "./pages/SinglePost";
import Navbar from "./components/Navbar";
import CreateCommunity from "./pages/CreateCommunity";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";


export default function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-community"
          element={
            <ProtectedRoute>
              <CreateCommunity />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/:communityId"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />

        <Route
          path="/post/:postId"
          element={
            <ProtectedRoute>
              <SinglePost />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
}
