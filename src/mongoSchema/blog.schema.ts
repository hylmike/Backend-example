import * as mongoose from 'mongoose';

export const BlogSchema = new mongoose.Schema({
  topic: String,
  category: String,
  creator: String,
  content: String,
  createTime: { type: Date, index: true },
  keywords: String,
});
