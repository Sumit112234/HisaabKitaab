import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  date: { type: Date, default: Date.now },
  splitBetween: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
