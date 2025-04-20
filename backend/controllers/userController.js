
// @desc    Get all users
// @route   GET /api/v1/users

import Group from "../models/Group.js";
import User from "../models/User.js";

// @access  Private
export const getUsers = async (req, res, next) => {
    const users = await User.find();
  
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  };
  
  // @desc    Get single user
  // @route   GET /api/v1/users/:id
  // @access  Private
  export const getUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }
  
    res.status(200).json({
      success: true,
      data: user
    });
  };

  export const searchUsers = async (req, res) => {
    try {
      const { email } = req.query;
  
      if (!email || email.trim() === "") {
        return res.status(400).json({ message: "Email query is required" });
      }
  
      // Case-insensitive partial match on email
      const users = await User.find({
        email: { $regex: email, $options: "i" }
      }).select("-password"); // Don't send password field
  
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({
        success: false,
        message: "Server Error while searching users",
      });
    }
  };
  
  
  // @desc    Get user's groups
  // @route   GET /api/v1/users/me/groups
  // @access  Private
  export const getUserGroups = async (req, res, next) => {
    console.log(req.body)
    const groups = await Group.find({
      'members.user': req.body.id
    });
  
    if (groups.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No Group Found',
        data: []
      });
    }
  
    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups
    });
  };