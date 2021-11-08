import * as mongoose from 'mongoose';

export const LibSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true,
    unique: true,
    trim: true,
  },
  password: { type: String, required: true, select: false },
  role: { type: String, required: true }, //admin or librarian
  email: { type: String, required: true },
  firstName: String,
  lastName: String,
  phoneNumber: String,
  registerDate: Date,
  creator: String, //creator id
  currentRefreshToken: { type: String, select: false },
  isActive: { type: Boolean, default: true },
});

export const OperationLogSchema = new mongoose.Schema({
  operator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Librarian',
  },
  time: Date,
  operation: String,
  details: String,
});
