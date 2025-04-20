import Group from "../models/Group.js";
import User from "../models/User.js";


export const createGroup = async (req, res, next) => {
  req.body.creator = req.body.createdBy;

  console.log(req.body);

  // Add current user as a member with active status
  const members = [{
    user: req.body.createdBy,
    status: 'active'
  }];
  
  // Add other members from request
  if (req.body.memberIds && req.body.memberIds.length > 0) {
    for (const memberId of req.body.memberIds) {
      // Check if user exists
      // const userExists = await User.findById(memberId);
      // if (!userExists) {
      //   return next(
      //     new ErrorResponse(`User not found with id of ${memberId}`, 404)
      //   );
      // }
      
      // Add as invited member
      if(memberId !== req.body.createdBy)
      {
        members.push({
          user: memberId,
          status: 'invited'
        });
      }
    }
  }
  
  const groupData = {
    name: req.body.name,
    creator: req.body.createdBy,
    members
  };
  
  const group = await Group.create(groupData);
  
  // Add group to creator's groups
  await User.findByIdAndUpdate(req.body.createdBy, {
    $push: { groups: group._id }
  });
  
  // Add group to all invited members' groups
  for (const member of members) {
    if (member.user.toString() !== req.body.createdBy) {
      await User.findByIdAndUpdate(member.user, {
        $push: { groups: group._id }
      });
    }
  }
  
  res.status(201).json({
    success: true,
    data: group
  });
};


// export const createGroup = async (req, res) => {
//   const { name, members } = req.body;
//   const group = await Group.create({ name, members, createdBy: req.user._id });

//   // Add group to users
//   await User.updateMany(
//     { _id: { $in: members } },
//     { $push: { groups: group._id } }
//   );

//   res.status(201).json(group);
// };

export const getGroups = async (req, res, next) => {
  const groups = await Group.find({
    'members.user': req.user.id
  }).populate('members.user', 'name email');
  
  res.status(200).json({
    success: true,
    count: groups.length,
    data: groups
  });
};

// @desc    Get single group
// @route   GET /api/v1/groups/:id
// @access  Private
export const getGroup = async (req, res, next) => {
  console.log(req.params.id)
  const group = await Group.findById(req.params.id).populate('members.user', 'name email');
  
  if (!group) {
    
      res.status(400).json({
        message : "No group Found"
      })
    
  }
  
  // Make sure user is a member of the group
  // if (!group.members.some(member => member.user._id.toString() === req.user.id)) {
  //   return next(
  //     new ErrorResponse(`User ${req.user.id} is not authorized to access this group`, 401)
  //   );
  // }
  
  res.status(200).json({
    success: true,
    data: group
  });
};

// @desc    Accept group invitation
// @route   PUT /api/v1/groups/:id/accept
// @access  Private
export const acceptInvitation = async (req, res, next) => {

  console.log("Group Id : ", req.params.groupId)
  let group = await Group.findById(req.params.groupId);
  console.log(req.query.id);
  if (!group) {
    
     return res.status(400).json({
        message : "No group Found"
      })
    
  }
  
  // Check if user is invite to this group
  const memberIndex = group.members.findIndex(
    member => member.user.toString() === req.query.id && member.status === 'invited'
  );
  
  if (memberIndex === -1) {
   return res.status(200).json({
      message : "No pending Invitation Found"
    })
  }
  
  // Update member status to active
  console.log(group, memberIndex , req.query.id)
  group.members[memberIndex].status = 'active';
  await group.save();
  
  return res.status(200).json({
    success: true,
    data: group
  });
};

// @desc    Leave group
// @route   PUT /api/v1/groups/:id/leave
// @access  Private
export const leaveGroup = async (req, res, next) => {
  const group = await Group.findById(req.params.id);
  
  if (!group) {
    return res.status(400).json({
      message : "No group Found"
    })
  }
  
  // Check if user is a member of this group
  // const memberIndex = group.members.findIndex(
  //   member => member.user.toString() === req.user.id
  // );
  
  // if (memberIndex === -1) {
  //   return next(
  //     new ErrorResponse(`You are not a member of this group`, 400)
  //   );
  // }
  
  // Cannot leave if you're the creator and there are other active members
  // if (group.creator.toString() === req.user.id) {
  //   const activeMembers = group.members.filter(
  //     member => member.status === 'active' && member.user.toString() !== req.user.id
  //   );
    
  //   if (activeMembers.length > 0) {
  //     return next(
  //       new ErrorResponse(`Please transfer ownership before leaving the group`, 400)
  //     );
  //   }
  // }
  
  // Update member status to left
  group.members[memberIndex].status = 'left';
  await group.save();
  
  // Remove group from user's groups
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { groups: group._id }
  });
  
  res.status(200).json({
    success: true,
    data: {}
  });
};

// @desc    Add members to group
// @route   PUT /api/v1/groups/:id/members
// @access  Private
export const addMembers = async (req, res, next) => {
  const group = await Group.findById(req.params.id);
  
  if (!group) {
    res.status(400).json({
      message : "No group Found"
    })
  }
  
  // Check if user is active member of this group
  const isMember = group.members.some(
    member => member.user.toString() === req.user.id && member.status === 'active'
  );
  
  if (!isMember) {
    res.status(400).json({
      message : "No Member Found"
    })
  }
  
  // Add new members
  const newMembers = req.body.members;
  
  if (!newMembers || !Array.isArray(newMembers) || newMembers.length === 0) {
    res.status(400).json({
      message : "Please provide members"
    })
  }
  
  for (const memberId of newMembers) {
    // Check if user exists
    const userExists = await User.findById(memberId);
    if (!userExists) {
      return next(
        res.status(400).json({
          message : "User not Found"
        })
      );
    }
    
    // Check if user is already a member
    const alreadyMember = group.members.some(
      member => member.user.toString() === memberId
    );
    
    if (!alreadyMember) {
      // Add as invited member
      group.members.push({
        user: memberId,
        status: 'invited'
      });
      
      // Add group to user's groups
      await User.findByIdAndUpdate(memberId, {
        $push: { groups: group._id }
      });
    }
  }
  
  await group.save();
  
  res.status(200).json({
    success: true,
    data: group
  });
};

