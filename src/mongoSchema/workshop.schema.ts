import * as mongoose from 'mongoose';

export const WorkshopSchema = new mongoose.Schema({
  topic: String,
  place: String,
  organizer: String,
  subscriber: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscriber',
    },
  ],
  startTime: Date,
  duration: Number, //unit: hour
  poster: String, //poster img file url, 640*480 or bigger
  creator: String, //creator id
  createTime: Date,
  remark: String,
});

export interface Workshop {
  _id: string;
  topic: string;
  place: string;
  organizer: string;
  subscriber: [Subscriber];
  startTime: Date;
  duration: number;
  poster: string;
  creator: string;
  createTime: Date;
  remark: string;
}

export const SubscriberSchema = new mongoose.Schema({
  workshop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop',
  },
  readerID: String,
  //neighborhood: String,
  subscribeTime: Date,
});

export interface Subscriber {
  _id: string;
  workshop: string;
  readerID: string;
  subscribeTime: Date;
}

export type WorkshopDocument = Workshop & mongoose.Document;

export type SubscriberDocument = Subscriber & mongoose.Document;
