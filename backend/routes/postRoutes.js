import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { createPost, getPostsByCommunity, updatePost, deletePost, likePost,dislikePost,getSinglePost } from '../controllers/postController.js';

const router = express.Router();

router.post('/', authMiddleware, createPost);

// GET single post → must come BEFORE /:communityId
router.get('/post/:postId', getSinglePost);

// GET posts by community
router.get('/:communityId', getPostsByCommunity);

// Update post
router.patch('/:postId', authMiddleware, updatePost);

// Delete post
router.delete('/:postId', authMiddleware, deletePost);

// Like
router.post('/like/:postId', authMiddleware, likePost);

// Dislike
router.post('/dislike/:postId', authMiddleware, dislikePost);



export default router;
