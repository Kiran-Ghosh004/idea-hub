import Post from '../models/Post.js';

// CREATE POST
export const createPost = async (req, res) => {
  try {
    const { title, content, communityId } = req.body;

    // Basic validation
    if (!title || !content || !communityId) {
      return res.status(400).json({ message: "Title, content, and communityId are required" });
    }

    // ensure req.user exists (from auth middleware)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: missing user" });
    }

    // Create post
    const post = await Post.create({
      title,
      content,
      communityId,
      authorId: req.user   // from JWT middleware
    });

    res.status(201).json({
      message: "Post created successfully",
      post
    });

  } catch (error) {
    console.error("CREATE POST ERROR:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

// GET POSTS OF A COMMUNITY
export const getPostsByCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;

    if (!communityId) {
      return res.status(400).json({ message: "Community ID is required" });
    }

    const posts = await Post.find({ communityId })
      .populate("authorId", "name email")
      .sort({ createdAt: -1 }); // newest first

    res.json({
      count: posts.length,
      posts
    });

  } catch (error) {
    console.error("GET POSTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};


// UPDATE POST
export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;

    // Basic validation
    if (!title && !content) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    // Find post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the logged-in user is the author
    if (post.authorId.toString() !== req.user) {
      return res.status(403).json({ message: "Not allowed to edit this post" });
    }

    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;

    await post.save();

    res.json({
      message: "Post updated successfully",
      post,
    });

  } catch (error) {
    console.error("UPDATE POST ERROR:", error);
    res.status(500).json({ message: "Failed to update post" });
  }
};

// DELETE POST
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find the post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the logged-in user is the author
    if (post.authorId.toString() !== req.user) {
      return res.status(403).json({ message: "Not allowed to delete this post" });
    }

    // Delete the post
    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });

  } catch (error) {
    console.error("DELETE POST ERROR:", error);
    res.status(500).json({ message: "Failed to delete post" });
  }
};


// LIKE POST
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // If user already liked → unlike
    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
      await post.save();
      return res.json({ message: "Like removed", post });
    }

    // Add user to likes
    post.likes.push(userId);

    // Remove user from dislikes (if exists)
    post.dislikes.pull(userId);

    await post.save();

    res.json({ message: "Post liked", post });

  } catch (error) {
    console.error("LIKE POST ERROR:", error);
    res.status(500).json({ message: "Failed to like post" });
  }
};


// DISLIKE POST
export const dislikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // If user already disliked → remove dislike
    if (post.dislikes.includes(userId)) {
      post.dislikes.pull(userId);
      await post.save();
      return res.json({ message: "Dislike removed", post });
    }

    // Add user to dislikes
    post.dislikes.push(userId);

    // Remove like (if exists)
    post.likes.pull(userId);

    await post.save();

    res.json({ message: "Post disliked", post });

  } catch (error) {
    console.error("DISLIKE POST ERROR:", error);
    res.status(500).json({ message: "Failed to dislike post" });
  }
};


// GET SINGLE POST
export const getSinglePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("authorId", "name email")
      .populate("communityId", "name");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ post });

  } catch (error) {
    console.error("GET SINGLE POST ERROR:", error);
    res.status(500).json({ message: "Failed to fetch post" });
  }
};
