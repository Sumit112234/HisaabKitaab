import mongoose from 'mongoose';


const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an expense title'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an expense amount'],
    min: [0, 'Amount cannot be negative']
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  splitBetween: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  approvals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  requiredApprovals: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

expenseSchema.virtual('splitDetails').get(function () {
  const approvedCount = this.approvals.length;
  if (approvedCount === 0) return [];

  const amountPerPerson = this.amount / approvedCount;

  return this.approvals.map(userId => ({
    user: userId,
    amountToPay: amountPerPerson
  }));
});

expenseSchema.methods.isVerified = function () {
  return this.approvals.length >= this.requiredApprovals;
};

export default mongoose.model('Expense', expenseSchema);
