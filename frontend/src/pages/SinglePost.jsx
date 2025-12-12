import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function SinglePost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  const userId = localStorage.getItem("userId");

  const [showEdit, setShowEdit] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [showDelete, setShowDelete] = useState(false);

  const [expanded, setExpanded] = useState(false);

  const fetchPost = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/posts/post/${postId}`
      );
      setPost(res.data.post);

      setEditTitle(res.data.post.title);
      setEditContent(res.data.post.content);
    } catch (err) {
      alert("Failed to load post");
    }
  };

  const likePost = async () => {
    await axios.post(
      `http://localhost:5000/posts/like/${postId}`,
      {},
      { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
    );
    fetchPost();
  };

  const dislikePost = async () => {
    await axios.post(
      `http://localhost:5000/posts/dislike/${postId}`,
      {},
      { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
    );
    fetchPost();
  };

  const updatePost = async () => {
    await axios.patch(
      `http://localhost:5000/posts/${postId}`,
      { title: editTitle, content: editContent },
      { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
    );
    setShowEdit(false);
    fetchPost();
  };

  const deletePost = async () => {
    await axios.delete(`http://localhost:5000/posts/${postId}`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    window.location.href = "/dashboard";
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  if (!post)
    return (
      <p className="text-gray-400 text-center mt-20 text-xl">Loading post...</p>
    );

  const isAuthor = post.authorId?._id === userId;

  const previewText =
    post.content.length > 250 ? post.content.slice(0, 250) + "..." : post.content;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 text-white pt-24 pb-40 px-6 flex flex-col items-center">

      {/* ------------------------ EDIT MODAL ------------------------ */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-700 p-6 rounded-2xl w-full max-w-md shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-4">Edit Post</h2>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl text-white"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <textarea
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl text-white h-28"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowEdit(false)}
                  className="px-4 py-2 bg-gray-700 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={updatePost}
                  className="px-4 py-2 bg-indigo-600 rounded-xl"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ------------------------ DELETE MODAL ------------------------ */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-700 p-6 rounded-2xl w-full max-w-md shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-3">Delete Post?</h2>

            <p className="text-gray-400">
              Are you sure? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 bg-gray-700 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={deletePost}
                className="px-4 py-2 bg-red-600 rounded-xl"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ------------------------ MAIN POST ------------------------ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-3xl bg-gray-900 border border-gray-700 p-10 rounded-2xl shadow-xl"
      >
        {/* ACTION BUTTONS (TOP RIGHT) */}
        {isAuthor && (
          <div className="absolute top-6 right-6 flex gap-3">

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowEdit(true)}
              className="px-3 py-1.5 text-sm rounded-lg 
                       bg-indigo-600/20 border border-indigo-400/40 
                       text-indigo-300 hover:bg-indigo-600/30 
                       transition"
            >
              ✏️ Edit
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowDelete(true)}
              className="px-3 py-1.5 text-sm rounded-lg 
                       bg-red-600/20 border border-red-500/40 
                       text-red-300 hover:bg-red-600/30 
                       transition"
            >
              🗑 Delete
            </motion.button>

          </div>
        )}

        <h1 className="text-4xl font-bold leading-tight pr-28">{post.title}</h1>

        <p className="text-gray-400 mt-2">
          By <span className="text-gray-300">{post.authorId?.name}</span> ·{" "}
          {new Date(post.createdAt).toLocaleString()}
        </p>

        {/* LIKE / DISLIKE */}
        <div className="flex gap-4 mt-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={likePost}
            className="px-4 py-1 rounded-xl bg-gray-800 border border-gray-600"
          >
            👍 {post.likes.length}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={dislikePost}
            className="px-4 py-1 rounded-xl bg-gray-800 border border-gray-600"
          >
            👎 {post.dislikes.length}
          </motion.button>
        </div>

        {/* COLLAPSIBLE CONTENT */}
        <p className="mt-8 text-gray-200 text-lg leading-relaxed whitespace-pre-line">
          {expanded ? post.content : previewText}
        </p>

        {post.content.length > 250 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-indigo-400 underline mt-4"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </motion.div>

    </div>
  );
}
