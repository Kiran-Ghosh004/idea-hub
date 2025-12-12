import Community from '../models/Community.js';

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
      createdBy: req.user   // comes from JWT middleware
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
