import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Community() {
  const { communityId } = useParams();
  const navigate = useNavigate();

  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const userId = localStorage.getItem("userId");

  const [showDelete, setShowDelete] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const [showDeleteCommunity, setShowDeleteCommunity] = useState(false);

  const fetchCommunity = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/communities/${communityId}`
      );
      setCommunity(res.data.community || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/posts/${communityId}`);
      setPosts(res.data.posts);
    } catch (err) {
      console.log(err);
    }
  };

  const createPost = async () => {
    if (!title || !content) return alert("Title and content are required");

    try {
      await axios.post(
        "http://localhost:5000/posts",
        { title, content, communityId },
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );

      setTitle("");
      setContent("");
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create post");
    }
  };

  const likePost = async (postId) => {
    try {
      await axios.post(
        `http://localhost:5000/posts/like/${postId}`,
        {},
        { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      );
      fetchPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const dislikePost = async (postId) => {
    try {
      await axios.post(
        `http://localhost:5000/posts/dislike/${postId}`,
        {},
        { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      );
      fetchPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const deletePost = async () => {
    try {
      await axios.delete(`http://localhost:5000/posts/${selectedPostId}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });

      setShowDelete(false);
      setSelectedPostId(null);
      fetchPosts();
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  const deleteCommunity = async () => {
    try {
      await axios.delete(`http://localhost:5000/communities/${communityId}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });

      navigate("/dashboard");
    } catch (err) {
      alert("Failed to delete community");
    }
  };

  useEffect(() => {
    fetchCommunity();
    fetchPosts();
  }, [communityId]);

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-gray-900 via-black to-gray-800 text-white pt-24 pb-32 px-6">

      {/* ----------------------- DELETE COMMUNITY MODAL ----------------------- */}
      {showDeleteCommunity && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-700 p-6 rounded-2xl w-full max-w-md shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-4">Delete Community?</h2>
            <p className="text-gray-400">
              This will delete the community and <b>all posts inside it</b>.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteCommunity(false)}
                className="px-4 py-2 bg-gray-700 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={deleteCommunity}
                className="px-4 py-2 bg-red-600 text-white rounded-xl"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* -------------------------- DELETE POST MODAL -------------------------- */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-700 p-6 rounded-2xl w-full max-w-md shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-3">Delete Post?</h2>
            <p className="text-gray-400">This action cannot be undone.</p>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowDelete(false);
                  setSelectedPostId(null);
                }}
                className="px-4 py-2 bg-gray-700 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={deletePost}
                className="px-4 py-2 bg-red-600 text-white rounded-xl"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* --------------------------- COMMUNITY HEADER --------------------------- */}
      {!community ? (
        <p className="text-gray-300 text-center">Loading...</p>
      ) : (
        <div className="max-w-4xl mx-auto mb-10 relative">

          {community.createdBy?._id === userId && (
            <button
              onClick={() => setShowDeleteCommunity(true)}
              className="absolute right-0 top-0 px-4 py-1.5 rounded-xl bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30 transition"
            >
              🗑 Delete
            </button>
          )}

          <h1 className="text-4xl font-bold">{community.name}</h1>
          <p className="text-gray-400 mt-2 text-lg">{community.description}</p>
        </div>
      )}

      {/* --------------------------- CREATE POST BOX --------------------------- */}
      <div className="max-w-4xl mx-auto mb-12 bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-4">Create a Post</h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500"
          />

          <textarea
            placeholder="Write something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 h-32"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={createPost}
            className="px-6 py-2.5 bg-linear-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg w-fit"
          >
            ➕ Post
          </motion.button>
        </div>
      </div>

      {/* ------------------------------- POSTS LIST ------------------------------- */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6">Posts</h2>

        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center mt-16 mb-10"
          >
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-400 text-lg font-medium">No posts yet</p>
            <p className="text-gray-500 text-sm">
              Be the first to start a discussion!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => {
              const isAuthor = post.authorId?._id === userId;

              return (
                <motion.div
                  key={post._id}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="relative p-6 bg-gray-900 border border-gray-700 rounded-2xl shadow-xl"
                >
                  {isAuthor && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedPostId(post._id);
                        setShowDelete(true);
                      }}
                      className="absolute top-4 right-4 px-2 py-1 rounded-md bg-red-600/20 text-red-300 border border-red-500/25 hover:bg-red-600/30 transition text-sm"
                    >
                      🗑
                    </button>
                  )}

                  <Link to={`/post/${post._id}`}>
                    <h3 className="text-2xl font-semibold text-white">{post.title}</h3>
                    <p className="mt-2 text-gray-300 line-clamp-2">{post.content}</p>
                    <p className="text-sm text-gray-500 mt-3">
                      Posted by {post.authorId?.name}
                    </p>
                  </Link>

                  <div className="flex items-center gap-4 mt-5">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault();
                        likePost(post._id);
                      }}
                      className="px-4 py-1 rounded-xl bg-gray-800 border border-gray-600"
                    >
                      👍 {post.likes.length}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault();
                        dislikePost(post._id);
                      }}
                      className="px-4 py-1 rounded-xl bg-gray-800 border border-gray-600"
                    >
                      👎 {post.dislikes.length}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
