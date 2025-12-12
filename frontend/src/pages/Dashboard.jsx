import { useEffect, useState } from "react";
import axios from "axios";
import CommunityCard from "../components/CommunityCard";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [communities, setCommunities] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // FETCH ONLY MY COMMUNITIES
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

  // CREATE COMMUNITY
  const createCommunity = async () => {
    if (!name || !description) {
      alert("Name and description are required");
      return;
    }

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
    <div className="max-w-5xl mx-auto px-4 mt-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Communities</h1>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:opacity-90"
        >
          + Create Community
        </motion.button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
          >
            <h2 className="text-xl font-semibold mb-4">Create Community</h2>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Community name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-3 py-2 border rounded-lg h-24"
              />

              <div className="flex justify-end gap-3 mt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={createCommunity}
                  className="px-4 py-2 bg-primary text-white rounded-lg"
                >
                  Create
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Community list */}
      {communities.length === 0 ? (
        <p>You haven't created any communities yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {communities.map((c) => (
            <CommunityCard key={c._id} community={c} />
          ))}
        </div>
      )}
    </div>
  );
}
