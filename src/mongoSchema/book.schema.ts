import * as mongoose from 'mongoose';

export const BookSchema = new mongoose.Schema({
  bookTitle: {
    type: String,
    index: true,
    unique: true,
    trim: true,
    required: true,
  },
  isbnCode: {
    type: String,
    trim: true,
  },
  category: { type: String, required: true }, //refer to bottom
  format: { type: String, required: true }, //eBook, AudioBook, Podcast
  author: { type: String },
  language: { type: String, required: true },
  publisher: String,
  publishDate: Date,
  purchaseDate: Date,
  //quantity: Number,
  price: Number,
  coverPic: { type: String, required: true }, //url of book cover picture
  bookFile: { type: String, required: true }, //url of book file, pdf or audio file
  desc: String, //Brief description of book
  keywords: String,
  isActive: { type: Boolean, default: true },
  createDate: Date,
  creator: String, //creator id
  readTimes: Number,
  readDuration: Number,
  initialScore: Number,
  popularScore: { type: Number, index: true }, //initialScore + readTimes * w1 + sum(readDuration) * w2 which duration > N s
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookComment',
    },
  ],
  readHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookReadRecord',
    },
  ],
});

export const BookReadRecordSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  },
  readerID: String,
  startTime: Date,
  duration: Number, //unit:s
});

export const BookCommentSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  },
  readerName: String,
  title: String,
  comment: String,
  createTime: Date,
});

export const BookWishSchema = new mongoose.Schema({
  bookTitle: String,
  language: String,
  format: String,
  creator: String, //reader username
  //Quantity: Number,
  createTime: Date,
  status: String, //Under Review, Approved, Fullfiled, Rejected
});

/*
Politics --- General Politics
Press --- The written press
Romance --- Roman
Essay_sociology
Essay_philosophy
Essay_anthropology
Essay_ethnology
Information Technology
Comic --- Comic book
History
Geography
Dissertation --- Research, Memory and dissertation
Art_theatre
Art_music
Art_plastic --- plastic art
Art_design
Sport_football
Sport_basketball
Sport_handball
Sport_tennis
Sport_boxing
*/
