import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-6 text-white">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
          bg-white/5 backdrop-blur-xl border border-white/10 
          p-10 rounded-3xl shadow-2xl text-center max-w-lg
        "
      >
        {/* Big 404 number */}
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-7xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text"
        >
          404
        </motion.h1>

        <p className="text-gray-300 text-lg">
          Oops... The page you're looking for doesn’t exist.
        </p>

        <p className="text-gray-500 mt-2 mb-8">
          It might have been moved, deleted, or never existed at all.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

          <Link
            to="/"
            className="
              px-6 py-2.5 rounded-xl 
              bg-gradient-to-r from-indigo-500 to-purple-600 
              text-white font-medium shadow-lg hover:opacity-90 transition
            "
          >
            Go Home
          </Link>

          <Link
            to="/dashboard"
            className="
              px-6 py-2.5 rounded-xl
              bg-white/10 border border-white/20 
              text-gray-200 font-medium shadow hover:bg-white/20 transition
            "
          >
            Go to Dashboard
          </Link>
        </div>
      </motion.div>

    </div>
  );
}
