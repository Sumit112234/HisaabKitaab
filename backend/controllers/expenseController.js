import Expense from "../models/Expense.js";
import { calculateSplit } from "../utils/splitHelper.js";

export const addExpense = async (req, res) => {
  const { title, amount, groupId } = req.body;

  const members = req.body.splitBetween || [];
  const expense = await Expense.create({
    title,
    amount,
    paidBy: req.user._id,
    group: groupId,
    splitBetween: members.length ? members : [req.user._id]
  });

  res.status(201).json(expense);
};

export const getGroupExpenses = async (req, res) => {
  const { groupId } = req.params;
  const expenses = await Expense.find({ group: groupId })
    .populate("paidBy", "name")
    .sort({ createdAt: -1 });

  res.json(expenses);
};
