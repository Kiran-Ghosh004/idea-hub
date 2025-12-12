import { useEffect, useState } from "react";
import axios from "axios";
import CommunityCard from "../components/CommunityCard";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [communities, setCommunities] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchCommunities = async () => {
    try {
      const res = await axios.get("http://localhost:5000/communities/my", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setCommunities(res.data.communities);
    } catch (err) {
      alert("Failed to load your communities");
    }
  };

  const createCommunity = async () => {
    if (!name || !description) return alert("Name and description are required");

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

      setName("");
      setDescription("");
      setShowModal(false);
      fetchCommunities();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create community");
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white pt-24 pb-32 px-4 sm:px-6">

      {/* Header */}
      <div className="
        max-w-6xl mx-auto 
        flex flex-col sm:flex-row 
        justify-between sm:items-center 
        gap-4 sm:gap-0 mb-10
      ">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">
          My Communities
        </h1>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="
            w-full sm:w-auto 
            px-5 py-2.5 
            bg-gradient-to-r from-indigo-500 to-purple-600 
            text-white font-medium rounded-xl 
            shadow-lg shadow-purple-800/30
            hover:opacity-90 transition
          "
        >
          + Create Community
        </motion.button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="
              bg-white/10 backdrop-blur-xl 
              border border-white/20 
              p-6 rounded-2xl w-full max-w-md shadow-xl
            "
          >
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Create a New Community
            </h2>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Community name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
                  px-4 py-2 bg-white/10 text-white 
                  placeholder-gray-400 rounded-xl 
                  border border-white/20 focus:border-indigo-400 
                  focus:outline-none
                "
              />

              <textarea
                placeholder="Community description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="
                  px-4 py-2 bg-white/10 text-white 
                  placeholder-gray-400 rounded-xl h-28 
                  border border-white/20 focus:border-indigo-400 
                  focus:outline-none
                "
              />

              <div className="flex justify-end gap-3 mt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="
                    px-4 py-2 rounded-xl 
                    bg-gray-500/30 text-gray-200 
                    hover:bg-gray-500/40 transition
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={createCommunity}
                  className="
                    px-4 py-2 rounded-xl 
                    bg-gradient-to-r from-purple-500 to-indigo-500 
                    text-white shadow-md hover:opacity-90 transition
                  "
                >
                  Create
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* List / Empty State */}
      <div className="max-w-6xl mx-auto">
        {communities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center items-center mt-24 sm:mt-28 opacity-80 px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-7xl mb-4"
            >
              🌙
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-300 text-xl sm:text-2xl font-medium text-center"
            >
              You haven’t created any communities yet.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-500 mt-2 text-center text-sm sm:text-base"
            >
              Click “Create Community” to get started ✨
            </motion.p>
          </motion.div>
        ) : (
          <div className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-3 
            gap-6 sm:gap-8 mt-6
          ">
            {communities.map((c) => (
              <CommunityCard key={c._id} community={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
