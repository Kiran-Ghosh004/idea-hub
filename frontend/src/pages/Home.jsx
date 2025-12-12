import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const [communities, setCommunities] = useState([]);

  const fetchCommunities = async () => {
    try {
      const res = await axios.get("http://localhost:5000/communities");
      setCommunities(res.data.communities);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 text-white pt-24 px-6 pb-32">

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-12"
      >
        Explore Communities
      </motion.h1>

      {/* EMPTY STATE */}
      {communities.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center mt-20"
        >
          <div className="text-6xl mb-3">📭</div>
          <p className="text-gray-400 text-lg font-medium">No communities found</p>
          <p className="text-gray-500 text-sm">Be the first one to create a community!</p>
        </motion.div>
      ) : (
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {communities.map((c) => (
            <Link to={`/community/${c._id}`} key={c._id}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03, translateY: -5 }}
                transition={{ duration: 0.25 }}
                className="
                  p-6 rounded-2xl shadow-xl cursor-pointer border border-white/10 
                  bg-white/10 backdrop-blur-xl 
                  hover:bg-white/20 transition-all
                "
              >
                <h2 className="text-2xl font-semibold text-white">{c.name}</h2>

                <p className="text-gray-300 mt-3 line-clamp-2">
                  {c.description}
                </p>

                <p className="text-sm text-gray-400 mt-4">
                  Members: {c.members?.length || 0}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
