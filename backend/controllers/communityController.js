import Community from '../models/Community.js';
import Post from '../models/Post.js';

// CREATE COMMUNITY
export const createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Community name is required" });
    }

    const community = await Community.create({
      name,
      description,
      createdBy: req.user   // user ID from JWT middleware
    });

    res.status(201).json({
      message: "Community created successfully",
      community
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create community" });
  }
};


// GET ALL COMMUNITIES
export const getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find().populate("createdBy", "name email");

    res.json({
      count: communities.length,
      communities
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch communities" });
  }
};


// GET SINGLE COMMUNITY
export const getCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;

    const community = await Community.findById(communityId)
      .populate("createdBy", "name email");

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.json({ community });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch community" });
  }
};


// DELETE COMMUNITY (also deletes all posts inside it)
export const deleteCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;

    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Only the creator can delete the community
    if (community.createdBy.toString() !== req.user) {
      return res.status(403).json({
        message: "Not allowed to delete this community"
      });
    }

    // ⭐ delete every post inside this community
    await Post.deleteMany({ communityId });

    // delete the community itself
    await community.deleteOne();

    res.json({
      message: "Community and all its posts deleted successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete community" });
  }
};

// GET COMMUNITIES CREATED BY LOGGED-IN USER
export const getMyCommunities = async (req, res) => {
  try {
    const myCommunities = await Community.find({ createdBy: req.user })
      .populate("createdBy", "name email");

    res.json({
      count: myCommunities.length,
      communities: myCommunities
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch your communities" });
  }
};
