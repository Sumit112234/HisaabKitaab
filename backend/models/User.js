import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: { type: String, unique: true, required : true, trim: true, lowercase: true, },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
}, { timestamps: true });

export default mongoose.model('User', userSchema);
