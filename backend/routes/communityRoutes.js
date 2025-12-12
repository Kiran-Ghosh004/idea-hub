import express from 'express';
import { createCommunity, getAllCommunities } from '../controllers/communityController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create a community (protected)
router.post('/', authMiddleware, createCommunity);

// Get all communities (public)
router.get('/', getAllCommunities);

export default router;
