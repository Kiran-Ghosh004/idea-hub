import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function SinglePost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  const userId = localStorage.getItem("userId"); // logged in user

  // Edit modal states
  const [showEdit, setShowEdit] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Delete modal state
  const [showDelete, setShowDelete] = useState(false);

  const fetchPost = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/posts/post/${postId}`
      );

      setPost(res.data.post);

      // Pre-fill editing fields
      setEditTitle(res.data.post.title);
      setEditContent(res.data.post.content);

    } catch (err) {
      console.log(err);
      alert("Failed to load post");
    }
  };

  const likePost = async () => {
    try {
      await axios.post(
        `http://localhost:5000/posts/like/${postId}`,
        {},
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      fetchPost();
    } catch (err) {
      console.log(err);
    }
  };

  const dislikePost = async () => {
    try {
      await axios.post(
        `http://localhost:5000/posts/dislike/${postId}`,
        {},
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      fetchPost();
    } catch (err) {
      console.log(err);
    }
  };

  // UPDATE POST
  const updatePost = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/posts/${postId}`,
        {
          title: editTitle,
          content: editContent,
        },
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );

      setShowEdit(false);
      fetchPost();
    } catch (err) {
      console.log(err);
      alert("Failed to update post");
    }
  };

  // DELETE POST
  const deletePost = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/posts/${postId}`,
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );

      // Redirect after delete
      window.location.href = "/dashboard";

    } catch (err) {
      console.log(err);
      alert("Failed to delete post");
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  if (!post) return <p className="p-6">Loading post...</p>;

  const isAuthor = post.authorId?._id === userId;

  return (
    <div className="max-w-3xl mx-auto px-4 mt-10">

      {/* EDIT MODAL */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
          >
            <h2 className="text-xl font-semibold mb-4">Edit Post</h2>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                className="border p-2 rounded-lg"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <textarea
                className="border p-2 rounded-lg h-28"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowEdit(false)}
                  className="px-4 py-1 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={updatePost}
                  className="px-4 py-1 bg-primary text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
          >
            <h2 className="text-xl font-semibold mb-3">Delete Post?</h2>
            <p className="text-gray-600">
              This action cannot be undone. Are you sure you want to delete this post?
            </p>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-1 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={deletePost}
                className="px-4 py-1 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* MAIN POST DISPLAY */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-xl shadow"
      >
        <h1 className="text-3xl font-bold">{post.title}</h1>

        <p className="text-gray-600 mt-2">
          By {post.authorId?.name} · {new Date(post.createdAt).toLocaleString()}
        </p>

        {/* EDIT + DELETE BUTTONS */}
        {isAuthor && (
          <div className="flex gap-4 mt-3">
            <button
              onClick={() => setShowEdit(true)}
              className="text-primary underline"
            >
              Edit Post
            </button>

            <button
              onClick={() => setShowDelete(true)}
              className="text-red-500 underline"
            >
              Delete Post
            </button>
          </div>
        )}

        {/* Like & Dislike */}
        <div className="flex items-center gap-4 mt-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={likePost}
            className={`px-4 py-1 rounded-lg border ${
              post.likes.includes(userId)
                ? "bg-green-200 border-green-500"
                : "border-gray-300"
            }`}
          >
            👍 {post.likes.length}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={dislikePost}
            className={`px-4 py-1 rounded-lg border ${
              post.dislikes.includes(userId)
                ? "bg-red-200 border-red-500"
                : "border-gray-300"
            }`}
          >
            👎 {post.dislikes.length}
          </motion.button>
        </div>

        {/* CONTENT */}
        <p className="mt-6 text-lg text-gray-800 leading-relaxed">
          {post.content}
        </p>
      </motion.div>
    </div>
  );
}
