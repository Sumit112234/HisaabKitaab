// @desc    Get settlement summary for a group
// @route   GET /api/v1/groups/:groupId/settlements

import Expense from "../models/Expense.js";
import Group from "../models/Group.js";

// @access  Private
export const getGroupSettlements = async (req, res, next) => {
    const group = await Group.findById(req.params.groupId);
  
    if (!group) {
      return next(
        new ErrorResponse(`Group not found with id of ${req.params.groupId}`, 404)
      );
    }
  
    // Check if user is member of the group
    // const isMember = group.members.some(
    //   member => member.user.toString() === req.user.id
    // );
  
    // if (!isMember) {
    //   return next(
    //     new ErrorResponse('Not authorized to view settlements for this group', 401)
    //   );
    // }
  
    // Get all approved expenses for the group
    const expenses = await Expense.find({
      group: req.params.groupId,
      status: 'approved'
    })
    .populate([
      { path: 'paidBy', select: 'name email' },
      { path: 'shares.user', select: 'name email' }
    ]);
  
    // Calculate balances
    const balances = {};
    const settlements = [];
  
    // Initialize balances for all members
    group.members.forEach(member => {
      balances[member.user] = 0;
    });
  
    // Calculate net balance for each user
    expenses.forEach(expense => {
      // Add amount to the person who paid
      balances[expense.paidBy] += expense.amount;
  
      // Subtract share amounts from each member
      expense.shares.forEach(share => {
        balances[share.user] -= share.amount;
      });
    });
  
    // Convert balances to array for easier processing
    const balanceArray = Object.entries(balances).map(([userId, amount]) => ({
      userId,
      amount: parseFloat(amount.toFixed(2))
    }));
  
    // Sort by amount (descending for positive, ascending for negative)
    balanceArray.sort((a, b) => b.amount - a.amount);
  
    // Calculate settlements (who pays whom)
    let i = 0; // index for creditors (positive balance)
    let j = balanceArray.length - 1; // index for debtors (negative balance)
  
    while (i < j) {
      const creditor = balanceArray[i];
      const debtor = balanceArray[j];
  
      if (creditor.amount <= 0 || debtor.amount >= 0) {
        break; // No more settlements needed
      }
  
      const settlementAmount = Math.min(creditor.amount, -debtor.amount);
      
      if (settlementAmount > 0) {
        settlements.push({
          from: debtor.userId,
          to: creditor.userId,
          amount: parseFloat(settlementAmount.toFixed(2))
        });
  
        creditor.amount -= settlementAmount;
        debtor.amount += settlementAmount;
      }
  
      if (creditor.amount <= 0.01) i++; // Move to next creditor if balance is close to zero
      if (debtor.amount >= -0.01) j--; // Move to next debtor if balance is close to zero
    }
  
    // Get user details for settlements
    const populatedSettlements = await Promise.all(
      settlements.map(async (settlement) => {
        const fromUser = await User.findById(settlement.from).select('name email');
        const toUser = await User.findById(settlement.to).select('name email');
        
        return {
          from: fromUser,
          to: toUser,
          amount: settlement.amount
        };
      })
    );
  
    res.status(200).json({
      success: true,
      data: {
        balances: balanceArray,
        settlements: populatedSettlements
      }
    });
  };
  