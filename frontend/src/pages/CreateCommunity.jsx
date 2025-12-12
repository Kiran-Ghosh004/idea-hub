import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CreateCommunity() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const createCommunity = async () => {
    if (!name || !description) return alert("Fill all fields");

    try {
      await axios.post(
        "http://localhost:5000/communities",
        { name, description },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      navigate("/dashboard"); // after creation go to dashboard
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create community");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Create Community</h1>

      <input
        type="text"
        placeholder="Community name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-3 py-2 rounded-lg mb-3"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border px-3 py-2 rounded-lg h-24 mb-4"
      />

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={createCommunity}
        className="w-full bg-primary text-white py-2 rounded-lg shadow"
      >
        Create
      </motion.button>
    </div>
  );
}
