import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CreateCommunity() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const createCommunity = async () => {
    if (!name || !description) return alert("Please fill all fields");

    try {
      await axios.post(
        "http://localhost:5000/communities",
        { name, description },
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create community");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex justify-center items-center px-6">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          w-full max-w-lg 
          p-8 rounded-2xl shadow-xl 
          bg-white/10 backdrop-blur-xl 
          border border-white/20
        "
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Create a Community
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Community name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
              px-4 py-3 rounded-xl bg-white/10 text-white 
              placeholder-gray-400 border border-white/20 
              focus:outline-none focus:border-indigo-400
            "
          />

          <textarea
            placeholder="Community description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="
              px-4 py-3 rounded-xl bg-white/10 text-white 
              placeholder-gray-400 border border-white/20 
              h-28 focus:outline-none focus:border-indigo-400
            "
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={createCommunity}
            className="
              w-full py-3 text-white font-semibold rounded-xl 
              bg-gradient-to-r from-indigo-500 to-purple-600 
              shadow-lg hover:opacity-90 transition
            "
          >
            Create Community
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
