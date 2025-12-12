import { useState } from "react";
import { motion } from "framer-motion";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/auth/login", form);

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-linear-to-br from-gray-900 via-black to-gray-800 px-4 text-gray-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="
          w-full max-w-md p-8 
          rounded-2xl shadow-2xl 
          bg-white/10 backdrop-blur-xl 
          border border-white/20
        "
      >
        <h1 className="text-3xl font-semibold mb-6 text-white text-center">
          Welcome Back 👋
        </h1>
        <p className="text-gray-300 text-center mb-8 text-sm">
          Login to continue to <span className="font-semibold text-white">IdeaHub</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@mail.com"
            className="text-white"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="
              w-full py-3 
              rounded-xl font-semibold 
              bg-linear-to-r from-indigo-500 to-purple-600 
              text-white shadow-lg shadow-purple-800/30 
              hover:opacity-90 transition
            "
          >
            Login
          </motion.button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-300">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-400 hover:underline">
            Sign Up
          </a>
        </p>
      </motion.div>
    </div>
  );
}
