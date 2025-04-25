// @desc    Get settlement summary for a group
// @route   GET /api/v1/groups/:groupId/settlements

import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import User from "../models/User.js";


export const getGroupSettlements = async (req, res, next) => {
  const group = await Group.findById(req.params.groupId);

  if (!group) {
    return next(new ErrorResponse(`Group not found with id of ${req.params.groupId}`, 404));
  }

  // Fetch verified expenses with populated users

  const expenses = await Expense.find({
    group: req.params.groupId,
    status: 'verified'
  }).populate([
    { path: 'paidBy', select: 'name email' },
    { path: 'approvals', select: 'name email' }
  ]);

  const balances = {};

  // Initialize balances to zero
  group.members.forEach(member => {
    balances[member.user.toString()] = 0;
  });

  // Calculate individual balances
  expenses.forEach(expense => {
    const approvedUserIds = expense.approvals.map(user => user._id.toString());
    const shareAmount = expense.amount / approvedUserIds.length;

    // Add full amount to the payer
    balances[expense.paidBy._id.toString()] += expense.amount;

    // Subtract equal share from each approved user
    approvedUserIds.forEach(uid => {
      balances[uid] -= shareAmount;
    });
  });

  // Convert balances into an array
  const balanceArray = Object.entries(balances).map(([userId, amount]) => ({
    userId,
    amount: parseFloat(amount.toFixed(2))
  }));

  // 🆕 Save the original balances before modifying them for settlement
  const originalBalances = JSON.parse(JSON.stringify(balanceArray));

  // Sort balances: most positive (creditor) to most negative (debtor)
  balanceArray.sort((a, b) => b.amount - a.amount);

  const settlements = [];
  let i = 0, j = balanceArray.length - 1;

  while (i < j) {
    const creditor = balanceArray[i];
    const debtor = balanceArray[j];

    if (creditor.amount <= 0 || debtor.amount >= 0) break;

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

    if (creditor.amount <= 0.01) i++;
    if (debtor.amount >= -0.01) j--;
  }

  // Populate settlement user info
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

  // Final response
  res.status(200).json({
    success: true,
    data: {
      balances: originalBalances, // ✅ pre-settlement balances
      settlements: populatedSettlements // ✅ actual who-pays-whom logic
    }
  });
};


// @access  Private
// export const getGroupSettlements = async (req, res, next) => {
//     const group = await Group.findById(req.params.groupId);
  
//     if (!group) {
//       return next(
//         new ErrorResponse(`Group not found with id of ${req.params.groupId}`, 404)
//       );
//     }
  
//     // Check if user is member of the group
//     // const isMember = group.members.some(
//     //   member => member.user.toString() === req.user.id
//     // );
  
//     // if (!isMember) {
//     //   return next(
//     //     new ErrorResponse('Not authorized to view settlements for this group', 401)
//     //   );
//     // }
  
//     // Get all approved expenses for the group
//     const expenses = await Expense.find({
//       group: req.params.groupId,
//       status: 'verified'
//     })
//     .populate([
//       { path: 'paidBy', select: 'name email' },
//       { path: 'shares.user', select: 'name email' }
//     ]);
  
//     // Calculate balances
//     const balances = {};
//     const settlements = [];
  
//     // Initialize balances for all members
//     group.members.forEach(member => {
//       balances[member.user] = 0;
//     });
    
//     console.log(req.params.groupId,expenses ,  group.members , balances)
  
//     // Calculate net balance for each user
//     expenses.forEach(expense => {

//       balances[expense.paidBy._id] = expense.amount/expense.splitBetween.length;
//       // // Add amount to the person who paid
//       // balances[expense.paidBy._id] += expense.amount;
  
//       // // Subtract share amounts from each member
//       // expense.shares.forEach(share => {
//       //   balances[share.user] -= share.amount;
//       // });
//     });

  
//     // Convert balances to array for easier processing
//     const balanceArray = Object.entries(balances).map(([userId, amount]) => ({
//       userId,
//       amount: parseFloat(amount.toFixed(2))
//     }));
  
//     // Sort by amount (descending for positive, ascending for negative)
//     balanceArray.sort((a, b) => b.amount - a.amount);
  
//     // Calculate settlements (who pays whom)
//     let i = 0; // index for creditors (positive balance)
//     let j = balanceArray.length - 1; // index for debtors (negative balance)
  
//     while (i < j) {
//       const creditor = balanceArray[i];
//       const debtor = balanceArray[j];
  
//       if (creditor.amount <= 0 || debtor.amount >= 0) {
//         break; // No more settlements needed
//       }
  
//       const settlementAmount = Math.min(creditor.amount, -debtor.amount);
      
//       if (settlementAmount > 0) {
//         settlements.push({
//           from: debtor.userId,
//           to: creditor.userId,
//           amount: parseFloat(settlementAmount.toFixed(2))
//         });
  
//         creditor.amount -= settlementAmount;
//         debtor.amount += settlementAmount;
//       }
  
//       if (creditor.amount <= 0.01) i++; // Move to next creditor if balance is close to zero
//       if (debtor.amount >= -0.01) j--; // Move to next debtor if balance is close to zero
//     }
  
//     // Get user details for settlements
//     const populatedSettlements = await Promise.all(
//       settlements.map(async (settlement) => {
//         const fromUser = await User.findById(settlement.from).select('name email');
//         const toUser = await User.findById(settlement.to).select('name email');
        
//         return {
//           from: fromUser,
//           to: toUser,
//           amount: settlement.amount
//         };
//       })
//     );
  
//     res.status(200).json({
//       success: true,
//       data: {
//         balances: balanceArray,
//         settlements: populatedSettlements
//       }
//     });
//   };
  