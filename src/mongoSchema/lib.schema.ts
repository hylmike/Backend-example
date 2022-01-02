import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

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

export interface Lib {
  _id: string;
  username: string;
  password: string;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  registerDate: Date;
  creator: string;
  currentRefreshToken: string;
  isActive: boolean;
}

export const OperationLogSchema = new mongoose.Schema({
  operator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Librarian',
  },
  time: Date,
  operation: String,
  details: String,
});

export type LibDocument = Lib & Document;
