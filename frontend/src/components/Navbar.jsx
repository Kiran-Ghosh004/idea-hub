import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login");
    setOpen(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="
          fixed top-0 left-0 w-full z-50
          bg-black/40 backdrop-blur-xl
          border-b border-white/10
          px-6 py-3
        "
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* Logo */}
          <Link
            to="/"
            className="text-white font-bold text-2xl tracking-tight"
          >
            Idea<span className="text-indigo-400">Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link className="nav-item" to="/">Communities</Link>

            {token && (
              <>
                <Link className="nav-item" to="/dashboard">Dashboard</Link>
                <Link className="nav-item" to="/create-community">Create</Link>

                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={logout}
                  className="text-red-400 hover:text-red-300 text-sm font-medium"
                >
                  Logout
                </motion.button>
              </>
            )}

            {!token && (
              <>
                <Link className="nav-item" to="/login">Login</Link>
                <Link className="text-indigo-400 hover:text-indigo-300 font-medium text-sm" to="/signup">
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white text-2xl"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Local Styles */}
        <style>{`
          .nav-item {
            color: #e5e7eb;
            font-size: 0.95rem;
            font-weight: 500;
            transition: 0.25s ease;
          }
          .nav-item:hover {
            color: white;
          }
        `}</style>
      </motion.nav>

      {/* MOBILE MENU - DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="
              md:hidden fixed top-16 left-0 w-full 
              bg-black/50 backdrop-blur-xl 
              border-b border-white/10
              py-4 px-6 z-40
            "
          >
            <div className="flex flex-col gap-4 text-white text-lg">

              <Link to="/" onClick={() => setOpen(false)}>Communities</Link>

              {token && (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                  <Link to="/create-community" onClick={() => setOpen(false)}>Create</Link>

                  <button
                    onClick={logout}
                    className="text-red-400 text-left"
                  >
                    Logout
                  </button>
                </>
              )}

              {!token && (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="text-indigo-400"
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
