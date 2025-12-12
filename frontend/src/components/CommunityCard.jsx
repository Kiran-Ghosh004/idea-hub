import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CommunityCard({ community }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-5 bg-white rounded-xl shadow-md border border-gray-100 cursor-pointer"
    >
      <Link to={`/community/${community._id}`}>
        <h2 className="text-xl font-semibold text-gray-800">
          {community.name}
        </h2>
        <p className="text-gray-600 mt-1">{community.description}</p>
      </Link>
    </motion.div>
  );
}
