import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("userName");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    navigate("/login");
  };

  return (
    <div className="w-full bg-white shadow-md py-3 px-6 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-primary">
            Idea<span className="text-black">Hub</span>
          </h1>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-6">

          {/* Always visible */}
          <Link
            to="/"
            className="text-gray-700 hover:text-primary font-medium"
          >
            Communities
          </Link>

          {/* Only when logged in */}
          {token && (
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-primary font-medium"
              >
                Dashboard
              </Link>

              <Link
                to="/create-community"
                className="text-gray-700 hover:text-primary font-medium"
              >
                Create Community
              </Link>

              {/* User badge */}
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  {username ? username[0].toUpperCase() : "U"}
                </div>
                <span className="font-medium hidden sm:block">{username}</span>
              </div>

              {/* Logout */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="text-red-500 font-medium hover:underline"
              >
                Logout
              </motion.button>
            </>
          )}

          {/* If NOT logged in */}
          {!token && (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-primary font-medium hover:underline"
              >
                Signup
              </Link>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
