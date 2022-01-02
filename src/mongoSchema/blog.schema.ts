import * as mongoose from 'mongoose';

export const BlogSchema = new mongoose.Schema({
  topic: String,
  category: String,
  creator: String,
  content: String,
  createTime: { type: Date, index: true },
  keywords: String,
});

export interface Blog {
  _id: string;
  topic: string;
  category: string;
  creator: string;
  content: string;
  createTime: Date;
  keywords: string;
}

export type BlogDocument = Blog & mongoose.Document;
