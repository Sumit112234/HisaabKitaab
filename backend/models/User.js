import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
}, { timestamps: true });

export default mongoose.model('User', userSchema);
