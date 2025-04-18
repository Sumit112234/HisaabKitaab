export const calculateSplit = (members, totalAmount) => {
    const perHead = totalAmount / members.length;
    return perHead;
  };
  

//   // server/models/User.js
// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { 
//     type: String, 
//     unique: true,
//     required: true
//   },
//   password: String,
//   groups: [{ 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Group' 
//   }],
// }, { 
//   timestamps: true 
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
  
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Method to check password
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// export default mongoose.models.User || mongoose.model('User', userSchema);

// // server/models/Group.js
// import mongoose from 'mongoose';

// const groupSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   members: [{ 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User' 
//   }],
//   createdBy: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User',
//     required: true
//   },
// }, { 
//   timestamps: true 
// });

// // Add virtual for getting pending expenses
// groupSchema.virtual('pendingExpenses', {
//   ref: 'Expense',
//   localField: '_id',
//   foreignField: 'group',
//   match: { status: 'pending' }
// });

// // Add virtual for getting verified expenses
// groupSchema.virtual('verifiedExpenses', {
//   ref: 'Expense',
//   localField: '_id',
//   foreignField: 'group',
//   match: { status: 'verified' }
// });

// export default mongoose.models.Group || mongoose.model('Group', groupSchema);

// // server/models/Expense.js
// import mongoose from 'mongoose';

// const approvalSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   approved: {
//     type: Boolean,
//     default: false
//   },
//   approvedAt: Date
// }, { _id: false });

// const expenseSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   amount: {
//     type: Number,
//     required: true
//   },
//   paidBy: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User',
//     required: true
//   },
//   group: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Group',
//     required: true
//   },
//   date: { 
//     type: Date, 
//     default: Date.now 
//   },
//   description: String,
//   splitBetween: [{ 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User' 
//   }],
//   approvals: [approvalSchema],
//   status: {
//     type: String,
//     enum: ['pending', 'verified'],
//     default: 'pending'
//   },
//   requiredApprovals: {
//     type: Number,
//     required: true
//   }
// }, { 
//   timestamps: true 
// });

// // Method to check if expense has enough approvals to be verified
// expenseSchema.methods.checkVerificationStatus = async function() {
//   const approvedCount = this.approvals.filter(a => a.approved).length;
  
//   if (approvedCount >= this.requiredApprovals) {
//     this.status = 'verified';
//     await this.save();
//     return true;
//   }
  
//   return false;
// };

// export default mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

// // server/api/auth.js
// import jwt from 'jsonwebtoken';
// import User from '../models/User';

// // JWT Secret
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// // Generate JWT token
// export const generateToken = (userId) => {
//   return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
// };

// // Middleware to verify JWT token
// export const authenticateUser = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
    
//     if (!token) {
//       return res.status(401).json({ message: 'Authentication required' });
//     }
    
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const user = await User.findById(decoded.id).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
    
//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // server/api/routes/auth.js
// import express from 'express';
// import User from '../../models/User';
// import { generateToken } from '../auth';

// const router = express.Router();

// // Register new user
// router.post('/register', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
    
//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }
    
//     // Create new user
//     const user = new User({
//       name,
//       email,
//       password
//     });
    
//     await user.save();
    
//     // Generate token
//     const token = generateToken(user._id);
    
//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Login user
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     // Find user
//     const user = await User.findOne({ email });
    
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }
    
//     // Generate token
//     const token = generateToken(user._id);
    
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// export default router;

// // server/api/routes/groups.js
// import express from 'express';
// import Group from '../../models/Group';
// import User from '../../models/User';
// import { authenticateUser } from '../auth';

// const router = express.Router();

// // Get all groups for current user
// router.get('/', authenticateUser, async (req, res) => {
//   try {
//     const groups = await Group.find({ members: req.user._id })
//       .populate('members', 'name email')
//       .populate('createdBy', 'name email');
      
//     res.json(groups);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Create new group
// router.post('/', authenticateUser, async (req, res) => {
//   try {
//     const { name, memberEmails } = req.body;
    
//     // Find users by emails
//     const memberUsers = await User.find({ email: { $in: memberEmails } });
//     const memberIds = memberUsers.map(user => user._id);
    
//     // Add current user if not already included
//     if (!memberIds.includes(req.user._id)) {
//       memberIds.push(req.user._id);
//     }
    
//     // Create group
//     const group = new Group({
//       name,
//       members: memberIds,
//       createdBy: req.user._id
//     });
    
//     await group.save();
    
//     // Update users' group lists
//     await User.updateMany(
//       { _id: { $in: memberIds } },
//       { $push: { groups: group._id } }
//     );
    
//     // Populate members and creator
//     await group.populate('members', 'name email');
//     await group.populate('createdBy', 'name email');
    
//     res.status(201).json(group);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get single group
// router.get('/:id', authenticateUser, async (req, res) => {
//   try {
//     const group = await Group.findById(req.params.id)
//       .populate('members', 'name email')
//       .populate('createdBy', 'name email');
      
//     if (!group) {
//       return res.status(404).json({ message: 'Group not found' });
//     }
    
//     // Check if user is a member
//     if (!group.members.some(member => member._id.equals(req.user._id))) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }
    
//     res.json(group);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Add member to group
// router.post('/:id/members', authenticateUser, async (req, res) => {
//   try {
//     const { email } = req.body;
    
//     // Find group
//     const group = await Group.findById(req.params.id);
    
//     if (!group) {
//       return res.status(404).json({ message: 'Group not found' });
//     }
    
//     // Check if user is a member
//     if (!group.members.some(member => member.equals(req.user._id))) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }
    
//     // Find user by email
//     const user = await User.findOne({ email });
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
    
//     // Check if already a member
//     if (group.members.some(member => member.equals(user._id))) {
//       return res.status(400).json({ message: 'User is already a member' });
//     }
    
//     // Add to group
//     group.members.push(user._id);
//     await group.save();
    
//     // Add group to user
//     user.groups.push(group._id);
//     await user.save();
    
//     // Return updated group
//     const updatedGroup = await Group.findById(req.params.id)
//       .populate('members', 'name email')
//       .populate('createdBy', 'name email');
      
//     res.json(updatedGroup);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// export default router;

// // server/api/routes/expenses.js
// import express from 'express';
// import Expense from '../../models/Expense';
// import Group from '../../models/Group';
// import { authenticateUser } from '../auth';

// const router = express.Router();

// // Get all expenses for a group
// router.get('/group/:groupId', authenticateUser, async (req, res) => {
//   try {
//     const { groupId } = req.params;
//     const { status } = req.query;
    
//     // Find group and check membership
//     const group = await Group.findById(groupId);
    
//     if (!group) {
//       return res.status(404).json({ message: 'Group not found' });
//     }
    
//     if (!group.members.includes(req.user._id)) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }
    
//     // Query filter
//     const filter = { group: groupId };
//     if (status) {
//       filter.status = status;
//     }
    
//     // Get expenses
//     const expenses = await Expense.find(filter)
//       .populate('paidBy', 'name email')
//       .populate('splitBetween', 'name email')
//       .populate('approvals.user', 'name email')
//       .sort({ createdAt: -1 });
      
//     res.json(expenses);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Create new expense
// router.post('/', authenticateUser, async (req, res) => {
//   try {
//     const { title, amount, paidBy, groupId, description, splitBetween } = req.body;
    
//     // Find group and check membership
//     const group = await Group.findById(groupId)
//       .populate('members', 'name email');
    
//     if (!group) {
//       return res.status(404).json({ message: 'Group not found' });
//     }
    
//     if (!group.members.some(member => member._id.equals(req.user._id))) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }
    
//     // Calculate required approvals (half of group members)
//     const requiredApprovals = Math.ceil(group.members.length / 2);
    
//     // Create approvals array with creator automatically approving
//     const approvals = group.members.map(member => ({
//       user: member._id,
//       approved: member._id.equals(req.user._id),
//       approvedAt: member._id.equals(req.user._id) ? new Date() : null
//     }));
    
//     // Create expense
//     const expense = new Expense({
//       title,
//       amount,
//       paidBy,
//       group: groupId,
//       description,
//       splitBetween: splitBetween || group.members.map(m => m._id),
//       approvals,
//       requiredApprovals
//     });
    
//     // Check if auto-approved (if creator is the only member needed for approval)
//     if (approvals.filter(a => a.approved).length >= requiredApprovals) {
//       expense.status = 'verified';
//     }
    
//     await expense.save();
    
//     // Populate references
//     await expense.populate('paidBy', 'name email');
//     await expense.populate('splitBetween', 'name email');
//     await expense.populate('approvals.user', 'name email');
    
//     res.status(201).json(expense);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Toggle expense approval
// router.put('/:id/approval', authenticateUser, async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Find expense
//     const expense = await Expense.findById(id);
    
//     if (!expense) {
//       return res.status(404).json({ message: 'Expense not found' });
//     }
    
//     // Find group and check membership
//     const group = await Group.findById(expense.group);
    
//     if (!group.members.includes(req.user._id)) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }
    
//     // Toggle approval
//     const approvalIndex = expense.approvals.findIndex(
//       a => a.user.toString() === req.user._id.toString()
//     );
    
//     if (approvalIndex === -1) {
//       return res.status(400).json({ message: 'User not in group' });
//     }
    
//     expense.approvals[approvalIndex].approved = !expense.approvals[approvalIndex].approved;
//     expense.approvals[approvalIndex].approvedAt = expense.approvals[approvalIndex].approved ? new Date() : null;
    
//     // Check if threshold reached for verification
//     await expense.checkVerificationStatus();
//     await expense.save();
    
//     // Return updated expense
//     const updatedExpense = await Expense.findById(id)
//       .populate('paidBy', 'name email')
//       .populate('splitBetween', 'name email')
//       .populate('approvals.user', 'name email');
      
//     res.json(updatedExpense);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// export default router;

// // server/index.js
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';

// // Routes
// import authRoutes from './api/routes/auth';
// import groupRoutes from './api/routes/groups';
// import expenseRoutes from './api/routes/expenses';

// // Load environment variables
// dotenv.config();

// // Create Express app
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/hisaab-barabar')
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Could not connect to MongoDB', err));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/groups', groupRoutes);
// app.use('/api/expenses', expenseRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!', error: err.message });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));