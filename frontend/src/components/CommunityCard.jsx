import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CommunityCard({ community }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.25 }}
      className="
        p-5 rounded-2xl 
        bg-white/10 backdrop-blur-xl
        border border-white/20 
        shadow-lg shadow-black/30 
        hover:bg-white/20 
        cursor-pointer
        transition
      "
    >
      <Link to={`/community/${community._id}`}>
        <h2 className="text-xl font-semibold text-white">
          {community.name}
        </h2>

        <p className="text-gray-300 mt-1">
          {community.description}
        </p>
      </Link>
    </motion.div>
  );
}
