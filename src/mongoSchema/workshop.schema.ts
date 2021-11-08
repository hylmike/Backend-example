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

export const SubscriberSchema = new mongoose.Schema({
  workshop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop',
  },
  readerID: String,
  //neighborhood: String,
  SubscribeTime: Date,
});
