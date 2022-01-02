import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ReaderDocument } from '../mongoSchema/reader.schema';
import {
  SubscriberDocument,
  Workshop,
  WorkshopDocument,
} from '../mongoSchema/workshop.schema';
import { Logger } from 'winston';
import {
  Reader,
  RegWorkshopInput,
  Subscriber,
  SubWorkshopInput,
  UpdateWorkshopInput,
} from '../graphql';

@Injectable()
export class WorkshopService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel('Workshop') private workshopModel: Model<WorkshopDocument>,
    @InjectModel('Subscriber') private subModel: Model<SubscriberDocument>,
    @InjectModel('Reader') private readerModel: Model<ReaderDocument>,
  ) {}

  async register(regWorkshopData: RegWorkshopInput): Promise<Workshop> {
    let workshop = await this.workshopModel.findOne({
      topic: regWorkshopData.topic,
    });
    if (workshop) {
      this.logger.warn(
        `Duplicated workshop with topic ${regWorkshopData.topic}, register failed`,
      );
      return null;
    }
    const now = new Date();
    workshop = new this.workshopModel({
      topic: regWorkshopData.topic,
      place: regWorkshopData.place,
      organizer: regWorkshopData.organizer,
      startTime: new Date(regWorkshopData.startTime),
      duration:
        regWorkshopData.duration == '' ? 0 : Number(regWorkshopData.duration),
      poster: regWorkshopData.poster,
      creator: regWorkshopData.creator,
      createTime: now,
      remark: regWorkshopData.remark,
    });
    try {
      const newWorkshop = await workshop.save();
      //Create log for this actitity
      this.logger.info(`Success create workshop ${newWorkshop.topic}`);
      return newWorkshop;
    } catch (err) {
      this.logger.error(
        `Saving new workshop ${workshop.topic} into database failed: ${err}`,
      );
      return null;
    }
  }

  async getWorkshop(workshopID): Promise<Workshop> {
    const workshop = await this.workshopModel.findById(workshopID);
    if (!workshop) {
      this.logger.warn(
        `Workshop ${workshopID} does not exist, get workshop failed`,
      );
      return null;
    }
    //Create log for this actitity
    this.logger.info(`Success get workshop ${workshop.topic}`);
    return workshop;
  }

  async getWsList(num): Promise<Workshop[]> {
    let wsList: Workshop[];
    const wsNum = Number(num);
    if (num == 0) {
      wsList = await this.workshopModel.find({}).sort({ startTime: -1 }).exec();
    } else if (num > 0) {
      wsList = await this.workshopModel
        .find({})
        .sort({ startTime: -1 })
        .limit(wsNum)
        .exec();
    }
    if (wsList) {
      this.logger.info('Success get workshop list');
      return wsList;
    }
    this.logger.warn('Failed to get workshop list');
    return null;
  }

  async updateWorkshop(
    updateWorkshopData: UpdateWorkshopInput,
  ): Promise<Workshop> {
    const workshop = await this.workshopModel.findById(updateWorkshopData.id);
    if (!workshop) {
      this.logger.warn(
        `Workshop ${updateWorkshopData.id} does not exist, update workshop failed`,
      );
      return null;
    }
    for (const item in updateWorkshopData) {
      switch (item) {
        case 'startTime':
          if (updateWorkshopData[item] !== '')
            workshop[item] = new Date(updateWorkshopData[item]);
          break;
        case 'duration':
          if (updateWorkshopData[item] !== '')
            workshop[item] = Number(updateWorkshopData[item]);
          break;
        default:
          if (updateWorkshopData[item] !== '')
            workshop[item] = updateWorkshopData[item];
      }
    }
    try {
      await workshop.save();
      //create log for this activity
      this.logger.info(`Success update workshop ${workshop.topic}`);
      return workshop;
    } catch (err) {
      this.logger.error(
        `Saving updated workshop ${workshop.topic} into database failed: ${err}`,
      );
      return null;
    }
  }

  async delWorkshop(workshopID) {
    const workshop = await this.workshopModel.findByIdAndDelete(workshopID);
    if (workshop) {
      this.logger.info(`Success delete workshop ${workshopID}`);
      return JSON.stringify(workshop._id);
    } else {
      this.logger.warn(`Failed to find and delete workshop ${workshopID}`);
      return null;
    }
  }

  async subWorkshop(subWorkshopData: SubWorkshopInput): Promise<Subscriber> {
    let sub = await this.subModel.findOne({
      workshop: subWorkshopData.workshopID,
      readerID: subWorkshopData.readerID,
    });
    if (sub) {
      this.logger.warn(
        `${subWorkshopData.readerID} already subscribed for ${subWorkshopData.workshopID}`,
      );
      return null;
    }
    //Save new subscribe info into database and update workshop document
    const now = new Date();
    sub = new this.subModel({
      workshop: subWorkshopData.workshopID,
      readerID: subWorkshopData.readerID,
      SubscribeTime: now,
    });
    const workshop = await this.workshopModel.findById(
      subWorkshopData.workshopID,
    );
    workshop.subscriber.push(sub._id);
    try {
      const newSub = await sub.save();
      await workshop.save();
      //create the log for this activity
      this.logger.info(
        `Success create subscriber ${newSub._id} for workshop ${workshop._id}`,
      );
      return newSub;
    } catch (err) {
      this.logger.error(
        `Saving subscriber ${sub._id} or update workshop ${workshop._id} failed: ${err}`,
      );
      return null;
    }
  }

  async unsubWorkshop(subID: string) {
    const sub = await this.subModel.findById(subID);
    if (!sub) {
      throw new HttpException(
        'Subscriber does not exist, unsubscribe failed',
        HttpStatus.NOT_FOUND,
      );
    }
    const workshop = await this.workshopModel.findById(sub.workshop);
    //delete subscriber from subscriber document and workshop subscribe array
    const delSub = await this.subModel.findByIdAndDelete(subID);
    for (const sub of workshop.subscriber) {
      if (sub.toString() === subID) {
        const index = workshop.subscriber.indexOf(sub);
        workshop.subscriber.splice(index, 1);
        break;
      }
    }
    try {
      await workshop.save();
      //create the log for this activity
      this.logger.info(
        `Success unsubscribe ${delSub.readerID} from workshop ${workshop.topic}`,
      );
      return delSub;
    } catch (err) {
      throw new HttpException(
        `Failed to update workshop when unsubscribing workshop: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSubWorkshops(readerID): Promise<Workshop[]> {
    const subList = await this.subModel.find({ readerID: readerID });
    if (subList.length > 0) {
      const wsList = await Promise.all(
        subList.map(async (sub) => {
          const workshop = await this.workshopModel.findById(sub.workshop);
          if (workshop) {
            return workshop;
          } else {
            return null;
          }
        }),
      );
      return wsList;
    } else {
      this.logger.info('Reader did not subscribe any workshop');
      return [];
    }
  }

  // async getSubName(subID) {
  //   const sub = await this.subModel.findById(subID);
  //   let readerName = '';
  //   if (sub) {
  //     const reader = await this.readerModel.findById(sub.readerID);
  //     if (reader) readerName = reader.username;
  //   } else {
  //     this.logger.warn(`Failed to get reader username from subscriber ${subID}`);
  //     return null;
  //   }
  //   this.logger.info(`Success get reader username from subscriber ${subID}`);
  //   return JSON.stringify(readerName);
  // }

  async getSubList(workshopID): Promise<Subscriber[]> {
    const workshop = await this.workshopModel
      .findById(workshopID)
      .populate('subscriber')
      .exec();
    //Check if workshop ID is correct, if not return null
    if (!workshop) {
      throw new HttpException(
        "Can't find workshop when get subscriber list",
        HttpStatus.NOT_FOUND,
      );
    }
    const subList = await Promise.all(
      workshop.subscriber.map(async (sub) => {
        const reader = await this.readerModel.findById(sub.readerID);
        return {
          _id: sub._id,
          workshop: sub.workshop,
          readerID: sub.readerID,
          subscribeTime: sub.subscribeTime,
          reader: reader,
        };
      }),
    );

    //create the log for this activity
    this.logger.info(
      `Success get subscriber list of workshop ${workshop.topic}`,
    );
    return subList;
  }
}
