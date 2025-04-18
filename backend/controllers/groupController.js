import Group from "../models/Group.js";
import User from "../models/User.js";

export const createGroup = async (req, res) => {
  const { name, members } = req.body;
  const group = await Group.create({ name, members, createdBy: req.user._id });

  // Add group to users
  await User.updateMany(
    { _id: { $in: members } },
    { $push: { groups: group._id } }
  );

  res.status(201).json(group);
};

export const getUserGroups = async (req, res) => {
  const groups = await Group.find({ members: req.user._id }).populate("members", "name email");
  res.json(groups);
};
