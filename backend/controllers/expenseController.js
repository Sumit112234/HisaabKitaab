import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import { calculateSplit } from "../utils/splitHelper.js";

// @desc    Get all expenses
// @route   GET /api/v1/expenses
// @route   GET /api/v1/groups/:groupId/expenses
// @access  Private
export const getExpenses = async (req, res, next) => {
  let query;

  if (req.query.groupId) {
    query = Expense.find({ group: req.query.groupId });
  } else {
    query = Expense.find();
  }

  const expenses = await query.populate([
    { path: 'paidBy', select: 'name email' },
    { path: 'group', select: 'name' },
  ]);

  // const expenses = await query.populate([
  //   { path: 'paidBy', select: 'name email' },
  //   { path: 'group', select: 'name' },
  //   { path: 'verifications.user', select: 'name email' },
  //   { path: 'shares.user', select: 'name email' }
  // ]);

  res.status(200).json({
    success: true,
    count: expenses.length,
    data: expenses
  });
};

// @desc    Get single expense
// @route   GET /api/v1/expenses/:id
// @access  Private
export const getExpense = async (req, res, next) => {
  const expense = await Expense.findById(req.params.id).populate([
    { path: 'paidBy', select: 'name email' },
    { path: 'group', select: 'name' },
    { path: 'verifications.user', select: 'name email' },
    { path: 'shares.user', select: 'name email' }
  ]);

  if (!expense) {
    return next(
      new ErrorResponse(`Expense not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: expense
  });
};

// @desc    Create new expense
// @route   POST /api/v1/groups/:groupId/expenses
// @access  Private
export const createExpense = async (req, res, next) => {
  // req.body.group = req.params.groupId;
  // req.body.paidBy = req.user.id;
  console.log(req.body);
  

  const group = await Group.findById(req.body.group);

  if (!group) {
    return res.status(400).json({
      message : "No Group Found!"
    })
  }

  // Check if user is member of the group
  // const isMember = group.members.some(
  //   member => member.user.toString() === req.user.id
  // );

  // if (!isMember) {
  //   return next(
  //     new ErrorResponse('Not authorized to create an expense in this group', 401)
  //   );
  // }

  // Add first verification from the creator
  if(req.body.currentUser === req.body.paidBy)
  {
    req.body.verifications = [{ user: req.body.currentUser }];
  }
  else
  {
    req.body.verifications = [{ user: req.body.currentUser }, {user : req.body.paidBy}];
  }

  // Calculate equal shares for all members
  const memberCount = group.members.length;
  const equalShare = req.body.amount / memberCount;

  req.body.shares = group.members.map(member => ({
    user: member.user,
    amount: equalShare,
    settled: member.user.toString() === req.body.paidBy // Mark as settled for the person who paid
  }));

  const expense = await Expense.create(req.body);

  res.status(201).json({
    success: true,
    data: expense
  });
};

// @desc    Verify expense
// @route   PUT /api/v1/expenses/:id/verify
// @access  Private
export const verifyExpense = async (req, res, next) => {
  let expense = await Expense.findById(req.params.id);
  console.log("req.query - > ", req.query.userId)


  if (!expense) {
    return next(
      new ErrorResponse(`Expense not found with id of ${req.params.id}`, 404)
    );
  }

  const group = await Group.findById(expense.group);

  if (!group) {
    return next(new ErrorResponse('Group not found', 404));
  }

  // Check if user is member of the group
  // const isMember = group.members.some(
  //   member => member.user.toString() === req.user.id
  // );

  // if (!isMember) {
  //   return next(
  //     new ErrorResponse('Not authorized to verify expenses in this group', 401)
  //   );
  // }

  // Check if user has already verified
  // const hasVerified = expense.verifications.some(
  //   verification => verification.user.toString() === req.user.id
  // );

  // if (hasVerified) {
  //   return next(new ErrorResponse('You have already verified this expense', 400));
  // }

  // Add verification
  console.log(expense.approvals, req.query.userId)
  if(!expense.approvals.find((id)=> id === req.query.userId)){

    console.log("inside")
    expense.approvals.push(req.query.userId);
  }

  // Check if more than half of members have verified
  const requiredVerifications = Math.ceil(group.members.length / 2);
  
  if (expense.approvals.length >= requiredVerifications) {
    expense.status = 'verified';
  }

  await expense.save();

  res.status(200).json({
    success: true,
    data: expense
  });
};

// @desc    Settle expense share
// @route   PUT /api/v1/expenses/:id/settle
// @access  Private
export const settleExpense = async (req, res, next) => {
  let expense = await Expense.findById(req.params.id);

  if (!expense) {
    return next(
      new ErrorResponse(`Expense not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if expense is approved
  if (expense.status !== 'approved') {
    return next(new ErrorResponse('Cannot settle a pending expense', 400));
  }

  // Find user's share
  const shareIndex = expense.shares.findIndex(
    share => share.user.toString() === req.user.id
  );

  if (shareIndex === -1) {
    return next(new ErrorResponse('You do not have a share in this expense', 404));
  }

  // Mark share as settled
  expense.shares[shareIndex].settled = true;
  await expense.save();

  res.status(200).json({
    success: true,
    data: expense
  });
};
