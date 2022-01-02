import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const ReaderProfileSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  gender: String,
  birthday: Date,
  phoneNumber: String,
  address: {
    homeAddress: String,
    province: String,
    postcode: String,
  },
  readTimes: Number,
  readDuration: Number, //unit:s
  score: Number, // readtimes * w1 + sum(duration) * w2 which duration > N min
  securityQuestion: String,
  securityAnswer: String,
});

export interface ReaderProfile {
  _id: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthday: Date;
  phoneNumber: string;
  address: {
    homeAddress: string;
    province: string;
    postcode: string;
  };
  readTimes: number;
  readDuration: number;
  score: number;
  securityQuestion: string;
  securityAnswer: string;
}

export const ReaderReadHistorySchema = new mongoose.Schema({
  bookID: String,
  currentPage: Number, //eBook:page_number, audioBook: time(s)
  startTime: Date,
  lastReadTime: Date,
  readTimes: Number,
  readDuration: Number, //unit:s
});

export interface ReaderReadHistory {
  _id: string;
  bookID: string;
  currentPage: number;
  startTime: Date;
  lastReadTime: Date;
  readTimes: number;
  readDuration: number;
}

export const ReaderSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true,
    unique: true,
    trim: false,
  },
  password: { type: String, required: true, select: false },
  email: { type: String, required: true },
  registerDate: Date,
  isActive: { type: Boolean, default: true },
  currentRefreshToken: { type: String, select: false },
  favouriteBook: [{ bookID: String, createDate: Date }],
  readerProfile: ReaderProfileSchema,
  readHistory: [ReaderReadHistorySchema],
});

export interface Reader {
  _id: string;
  username: string;
  password: string;
  email: string;
  registerDate: Date;
  isActive: boolean;
  currentRefreshToken: string;
  favouriteBook: [{ bookID: string; createDate: Date }];
  readerProfile: ReaderProfile;
  readHistory: [ReaderReadHistory];
}

export const TokenSchema = new mongoose.Schema({
  readerName: String,
  email: String,
  token: String,
  createTime: Date,
});

export type ReaderDocument = Reader & Document;

export type ReaderProDocument = ReaderProfile & Document;

export type ReaderReadHisDocument = ReaderReadHistory & Document;
