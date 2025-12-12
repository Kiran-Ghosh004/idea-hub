import { useState } from "react";
import { motion } from "framer-motion";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/auth/signup", form);
      const { token } = res.data;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-linear-to-br from-gray-900 via-black to-gray-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="
          w-full max-w-md p-8 mt-4
          rounded-2xl shadow-2xl
          bg-white/10 backdrop-blur-xl
          border border-white/20
        "
      >
        <h1 className="text-3xl font-semibold mb-4 text-center text-white">
          Create an Account ✨
        </h1>

        <p className="text-gray-300 text-center mb-8 text-sm">
          Join <span className="font-semibold text-white">IdeaHub</span> and start sharing your ideas!
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="text-gray-200 text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="
                w-full mt-1 px-4 py-2
                bg-white/10 text-white placeholder-gray-400
                rounded-xl border border-white/20
                focus:outline-none focus:border-indigo-400
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-200 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              className="
                w-full mt-1 px-4 py-2
                bg-white/10 text-white placeholder-gray-400
                rounded-xl border border-white/20
                focus:outline-none focus:border-indigo-400
              "
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-200 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="
                w-full mt-1 px-4 py-2
                bg-white/10 text-white placeholder-gray-400
                rounded-xl border border-white/20
                focus:outline-none focus:border-indigo-400
              "
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="
              w-full py-3 
              rounded-xl font-semibold 
              bg-linear-to-r from-purple-600 to-indigo-500
              text-white shadow-lg shadow-indigo-800/30 
              hover:opacity-90 transition
            "
          >
            Sign Up
          </motion.button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-400 hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}
