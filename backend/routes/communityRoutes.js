import express from 'express';
import {
  createCommunity,
  getAllCommunities,
  getCommunity,
  deleteCommunity,
  getMyCommunities 
} from '../controllers/communityController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create a community (protected)
router.post('/', authMiddleware, createCommunity);

// Get all communities (public)
router.get('/', getAllCommunities);

// ⭐ MUST COME BEFORE /:communityId
// Get ONLY user's communities
router.get('/my', authMiddleware, getMyCommunities);

// Get single community (public)
router.get('/:communityId', getCommunity);

// Delete community (protected)
router.delete('/:communityId', authMiddleware, deleteCommunity);

export default router;
