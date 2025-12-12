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

  // Delete Post Modal
  const [showDelete, setShowDelete] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Delete Community Modal
  const [showDeleteCommunity, setShowDeleteCommunity] = useState(false);

  // Fetch community info
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

  // Fetch posts of community
  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/posts/${communityId}`
      );
      setPosts(res.data.posts);
    } catch (err) {
      console.log(err);
    }
  };

  // Create Post
  const createPost = async () => {
    if (!title || !content) {
      alert("Title and content are required");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/posts",
        { title, content, communityId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );

      setTitle("");
      setContent("");

      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create post");
    }
  };

  // Like Post
  const likePost = async (postId) => {
    try {
      await axios.post(
        `http://localhost:5000/posts/like/${postId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );
      fetchPosts();
    } catch (err) {
      console.log(err);
    }
  };

  // Dislike Post
  const dislikePost = async (postId) => {
    try {
      await axios.post(
        `http://localhost:5000/posts/dislike/${postId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );
      fetchPosts();
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE POST
  const deletePost = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/posts/${selectedPostId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );

      setShowDelete(false);
      fetchPosts();
    } catch (err) {
      console.log(err);
      alert("Failed to delete post");
    }
  };

  // DELETE COMMUNITY
  const deleteCommunity = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/communities/${communityId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );

      window.location.href = "/dashboard";
    } catch (err) {
      console.log(err);
      alert("Failed to delete community");
    }
  };

  useEffect(() => {
    fetchCommunity();
    fetchPosts();
  }, [communityId]);

  return (
    <div className="max-w-4xl mx-auto px-4 mt-10">

      {/* DELETE COMMUNITY MODAL */}
      {showDeleteCommunity && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
          >
            <h2 className="text-xl font-semibold mb-3">Delete Community?</h2>
            <p className="text-gray-600">
              This will delete the community and <b>all posts inside it</b>.
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowDeleteCommunity(false)}
                className="px-4 py-1 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={deleteCommunity}
                className="px-4 py-1 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* DELETE POST MODAL */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
          >
            <h2 className="text-xl font-semibold mb-3">Delete Post?</h2>
            <p className="text-gray-600">This action cannot be undone.</p>

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

      {/* Community Info */}
      {!community ? (
        <p>Loading community...</p>
      ) : (
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {community.name}

            {/* DELETE COMMUNITY BUTTON */}
            {community.createdBy?._id === userId && (
              <button
                onClick={() => setShowDeleteCommunity(true)}
                className="text-red-500 underline text-base"
              >
                Delete Community
              </button>
            )}
          </h1>

          <p className="text-gray-600 mt-1">{community.description}</p>
        </div>
      )}

      {/* Create Post Box */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">Create Post</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />

          <textarea
            placeholder="Post content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="px-3 py-2 border rounded-lg h-24"
          />

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={createPost}
            className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:opacity-90 w-fit"
          >
            Post
          </motion.button>
        </div>
      </div>

      {/* Posts List */}
      <h2 className="text-2xl font-semibold mb-4">Posts</h2>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const isAuthor = post.authorId?._id === userId;

            return (
              <motion.div
                key={post._id}
                whileHover={{ scale: 1.01 }}
                className="p-5 bg-white rounded-xl shadow"
              >
                <Link to={`/post/${post._id}`} className="block cursor-pointer">
                  <h3 className="text-xl font-bold">{post.title}</h3>
                  <p className="mt-1 text-gray-700 line-clamp-2">{post.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Posted by: {post.authorId?.name}
                  </p>
                </Link>

                <div className="flex items-center gap-4 mt-4">

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.preventDefault();
                      likePost(post._id);
                    }}
                    className="px-3 py-1 rounded-lg border border-gray-300"
                  >
                    👍 {post.likes.length}
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.preventDefault();
                      dislikePost(post._id);
                    }}
                    className="px-3 py-1 rounded-lg border border-gray-300"
                  >
                    👎 {post.dislikes.length}
                  </motion.button>

                  {isAuthor && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedPostId(post._id);
                        setShowDelete(true);
                      }}
                      className="text-red-500 underline ml-2"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
