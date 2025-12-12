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
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">All Communities</h1>

      {communities.length === 0 ? (
        <p>No communities found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {communities.map((c) => (
            <Link to={`/community/${c._id}`} key={c._id}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-white shadow rounded-xl"
              >
                <h2 className="text-xl font-semibold">{c.name}</h2>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {c.description}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
