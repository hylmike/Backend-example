import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import {
  BookCommentInput,
  BookInput,
  BookInventory,
  CreateWishInput,
  GetWishlistInput,
  ReadRecordInput,
  SearchBookInput,
  UpdateWishInput,
} from '../graphql';
import {
  Book,
  BookReadRecord,
  BookComment,
  BookWish,
  BookCommentDoc,
  BookDocument,
  BookReadRecordDoc,
  BookWishDoc,
} from '../mongoSchema/book.schema';
import {
  ReaderDocument,
  ReaderReadHisDocument,
  ReaderReadHistory,
} from '../mongoSchema/reader.schema';

@Injectable()
export class BookService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel('Book') private readonly bookModel: Model<BookDocument>,
    @InjectModel('BookReadRecord')
    private readonly readRecordModel: Model<BookReadRecordDoc>,
    @InjectModel('BookComment')
    private readonly bookCommentModel: Model<BookCommentDoc>,
    @InjectModel('BookWish') private readonly bookWishModel: Model<BookWishDoc>,
    @InjectModel('Reader') private readonly readerModel: Model<ReaderDocument>,
    @InjectModel('ReaderReadHistory')
    private readonly readerHistoryModel: Model<ReaderReadHisDocument>,
  ) {}

  async register(createBookDto: BookInput): Promise<Book> {
    //First check if register book already existed in database
    const bookTitle = createBookDto.bookTitle.trim();
    if (await this.bookModel.findOne({ bookTitle: bookTitle })) {
      this.logger.warn(
        `Book ${bookTitle} already exists, please register another one`,
      );
      return null;
    }
    //If not exist, start registration
    const initialScore = createBookDto.initialScore
      ? createBookDto.initialScore
      : process.env.BOOK_SCORE_INITIAL_VALUE;
    const newBook = new this.bookModel({
      bookTitle: createBookDto.bookTitle,
      isbnCode: createBookDto.isbnCode,
      category: createBookDto.category,
      format: createBookDto.format,
      author: createBookDto.author,
      language: createBookDto.language,
      publisher: createBookDto.publisher,
      publishDate:
        createBookDto.publishDate == ''
          ? new Date(0)
          : new Date(
              new Date(createBookDto.publishDate).getTime() +
                new Date().getTimezoneOffset() * 60 * 1000,
            ),
      purchaseDate:
        createBookDto.purchaseDate == ''
          ? new Date(0)
          : new Date(
              new Date(createBookDto.purchaseDate).getTime() +
                new Date().getTimezoneOffset() * 60 * 1000,
            ),
      price: createBookDto.price == '' ? 0 : Number(createBookDto.price),
      coverPic: createBookDto.coverPic,
      bookFile: createBookDto.bookFile,
      desc: createBookDto.desc,
      keywords: createBookDto.keywords,
      creator: createBookDto.creator,
      isActive:
        createBookDto.isActive.toLowerCase() === 'active' ? true : false,
      createDate: new Date(),
      readTimes: 0,
      readDuration: 0,
      initialScore: Number(initialScore),
      popularScore: Number(initialScore),
    });
    try {
      const registerBook = await newBook.save();
      this.logger.info(`Success registered book ${registerBook.bookTitle}`);
      return registerBook;
    } catch (err) {
      this.logger.error(
        `Saving book ${newBook.bookTitle} failed when registering: ${err}`,
      );
      return null;
    }
  }

  async findBook(bookID: string): Promise<Book> {
    const book = await this.bookModel.findById(bookID);
    if (!book) {
      this.logger.warn(
        `Can not find book ${bookID} in database, get book failed`,
      );
      return null;
    }
    if (book.isActive === true) {
      this.logger.info(`Success get book ${book.bookTitle} from database`);
      return book;
    } else {
      this.logger.warn(`The book is in inactive status`);
      return null;
    }
  }

  async findAllBook(bookFormat: string): Promise<Book[]> {
    const bookList = await this.bookModel.find({
      format: bookFormat,
      isActive: true,
    });
    if (bookList) {
      this.logger.info(`Success find all ${bookFormat}`);
      return bookList;
    } else {
      this.logger.warn(`Failed to find ${bookFormat} from database`);
      return null;
    }
  }

  async findBookList(searchBookDto: SearchBookInput): Promise<Book[]> {
    //Create the seach condition object
    const conditions = {};
    const andClause = [];
    andClause.push({ isActive: true });
    for (const item in searchBookDto) {
      switch (item) {
        case 'format':
          andClause.push({ format: searchBookDto[item] });
          break;
        case 'category':
          if (searchBookDto[item] !== '') {
            andClause.push({ category: searchBookDto[item] });
          }
          break;
        case 'bookTitle':
          if (searchBookDto[item] !== '') {
            andClause.push({
              bookTitle: { $regex: searchBookDto[item], $options: 'i' },
            });
          }
          break;
        case 'author':
          if (searchBookDto[item] !== '') {
            andClause.push({
              author: { $regex: searchBookDto[item], $options: 'i' },
            });
          }
          break;
        case 'publishYear':
          const startTime = `${searchBookDto[item]}-01-01`;
          const endTime = `${searchBookDto[item]}-12-31`;
          if (searchBookDto[item] !== '') {
            andClause.push({
              publishDate: {
                $gte: new Date(startTime),
                $lte: new Date(endTime),
              },
            });
          }
          break;
      }
    }
    if (andClause.length > 0) {
      conditions['$and'] = andClause;
    }

    //Search book in dababase based on search array
    const bookList = await this.bookModel.find(conditions).exec();

    if (bookList) {
      this.logger.info('Success get book list based on search conditions');
      return bookList;
    } else {
      this.logger.warn('Failed to find book from database');
      return null;
    }
  }

  async searchBook(sval): Promise<Book[]> {
    const bookList = await this.bookModel
      .find({
        isActive: true,
        $or: [
          { bookTitle: { $regex: sval, $options: 'i' } },
          { category: { $regex: sval, $options: 'i' } },
          { author: { $regex: sval, $options: 'i' } },
          { keywords: { $regex: sval, $options: 'i' } },
          { desc: { $regex: sval, $options: 'i' } },
          { publisher: { $regex: sval, $options: 'i' } },
        ],
      })
      .exec();
    if (bookList) {
      this.logger.info('success get book list based on search input');
      return bookList;
    } else {
      this.logger.warn('Failed to get book list based on search input');
    }
  }

  async findHotBooks(num): Promise<Book[]> {
    const numBook = Number(num);
    if (numBook > 0) {
      const bookList = await this.bookModel
        .find({ isActive: true })
        .sort({ popularScore: -1 })
        .limit(numBook)
        .exec();
      return bookList;
    }
  }

  async sumInventory(): Promise<BookInventory[]> {
    const bookSumList = [];
    const bookCatList = [
      'Romance',
      'Politics',
      'Press',
      'Essay',
      'Information Technology',
      'Comic',
      'History',
      'Geography',
      'Dissertation',
      'Art',
      'Sport',
    ];
    for (const item of bookCatList) {
      const count = await this.bookModel
        .find({ category: { $regex: item, $options: 'i' } })
        .count()
        .exec();
      bookSumList.push({ category: item, count: count });
    }
    if (bookSumList.length === bookCatList.length) {
      this.logger.info('Success get book inventory summary from database');
      return bookSumList;
    } else {
      this.logger.warn('Failed to get book inventory summary from database');
      return null;
    }
  }

  async updateBookInfo(bookDto: BookInput) {
    const book = await this.bookModel.findOne({
      bookTitle: bookDto.bookTitle,
    });
    if (!book) {
      this.logger.warn(
        `Can not find book ${bookDto.bookTitle} when update its info`,
      );
      return null;
    }
    const w1 = Number(process.env.SCORE_W1);
    const w2 = Number(process.env.SCORE_W2);
    for (const item in bookDto) {
      switch (item) {
        case 'bookTitle':
          break;
        case 'publishDate':
        case 'purchaseDate':
          if (bookDto[item] !== this.formatDate(book[item])) {
            book[item] = new Date(
              new Date(bookDto[item]).getTime() +
                new Date().getTimezoneOffset() * 60 * 1000,
            );
          }
          break;
        case 'price':
          if (bookDto[item] !== book[item].toString())
            book[item] = Number(bookDto[item]);
          break;
        case 'initialScore':
          if (bookDto[item] !== book[item].toString())
            book[item] = Number(bookDto[item]);
          book.popularScore =
            book.initialScore + book.readTimes * w1 + book.readDuration * w2;
          break;
        case 'isActive':
          const value = bookDto[item].toLowerCase() === 'active' ? true : false;
          if (value !== book[item]) book[item] = value;
          break;
        case 'coverPic':
        case 'bookFile':
          if (bookDto[item] !== '') {
            book[item] = bookDto[item];
          }
          break;
        default:
          if (bookDto[item] !== book[item]) book[item] = bookDto[item];
      }
    }
    try {
      const updatedBook = await book.save();
      this.logger.info(`Success update info of book ${book._id}`);
      return updatedBook;
    } catch (err) {
      this.logger.error(
        `Failed to save update book ${book.bookTitle} info: ${err}`,
      );
      return null;
    }
  }

  async delBook(bookID: string) {
    try {
      const book = await this.bookModel.findByIdAndDelete(bookID);
      this.logger.info(`Success delete book ${bookID}`);
      return book;
    } catch (err) {
      this.logger.error(`Failed to delete book ${bookID}: ${err}`);
      return null;
    }
  }

  async addReadRecord(readRecordDto: ReadRecordInput) {
    //Read predefined global parameter for book popularscore calculation from env file
    const w0 = Number(process.env.SCORE_TIME_THRESHOLD); //default is 60s
    const w1 = Number(process.env.SCORE_W1); //default is 300, like 5min read each reading time
    const w2 = Number(process.env.SCORE_W2); //default is 1
    const bookID = readRecordDto.bookID;
    const readerID = readRecordDto.readerID;
    const startTime = new Date(readRecordDto.startTime);
    const currentPage = readRecordDto.currentPage;
    const duration = readRecordDto.duration;
    //Only consider read duration longer than SCORE_TIME_THRESHOLD (default:60s) as valid reading
    if (readRecordDto.duration > w0) {
      const book = await this.bookModel.findById(bookID);
      if (!book) {
        this.logger.warn(
          `Can not find book ${bookID}, adding book read record failed`,
        );
        return null;
      }
      //First check is this read record already in database
      if (
        await this.readRecordModel.findOne({
          book: bookID,
          readerID: readerID,
          startTime: startTime,
        })
      ) {
        this.logger.warn(`Read record already exist, adding record failed`);
        return null;
      }
      //If not exist, create new read record in mongoDB BookReadRecord document
      let newRecord = new this.readRecordModel({
        book: bookID,
        readerID: readerID,
        startTime: startTime,
        duration: duration,
      });
      //Update mongoDB book document with new read record
      book.readHistory.push(newRecord._id);
      book.readTimes += 1;
      book.readDuration += duration;
      book.popularScore =
        book.initialScore + book.readTimes * w1 + book.readDuration * w2;
      try {
        newRecord = await newRecord.save();
        await book.save();
        //Create log for this activity
        this.logger.info(`Success add readRecord ${newRecord._id}`);
      } catch (err) {
        this.logger.error(
          `Saving new read record or update book database failed: ${err}`,
        );
        return null;
      }
      this.addReaderReadHistory(
        readerID,
        bookID,
        startTime,
        currentPage,
        duration,
      );
      return newRecord;
    } else {
      this.logger.warn(`Read time less than threshold, invalid read record`);
      return null;
    }
  }

  async addReaderReadHistory(
    readerID: string,
    bookID: string,
    startTime: Date,
    currentPage: number,
    duration: number,
  ): Promise<ReaderReadHistory> {
    const reader = await this.readerModel.findById(readerID);
    if (!reader) {
      this.logger.warn(
        `Can not find the reader ${readerID} when update read history`,
      );
      return null;
    }
    let existInd = false;
    let record;
    const w1 = Number(process.env.SCORE_W1); //default is 300, like 5min read each reading time
    const w2 = Number(process.env.SCORE_W2); //default is 1
    //Check if book already read before, if did, update existing read record
    for (record of reader.readHistory) {
      if (record.bookID === bookID) {
        record.currentPage = currentPage;
        record.lastReadTime = startTime;
        record.readTimes += 1;
        record.readDuration += duration;
        existInd = true;
        break;
      }
    }
    if (existInd) {
      try {
        await reader.save();
        this.logger.info(
          `Success update read record of book ${bookID} for reader ${reader.username}`,
        );
        return record;
      } catch (err) {
        this.logger.error(
          `Update read history failed for reader ${reader.username}: ${err}`,
        );
        return null;
      }
    }
    //If book did not read before, create new read record
    if (!existInd) {
      const newReadRecord = new this.readerHistoryModel({
        bookID: bookID,
        currentPage: currentPage,
        startTime: startTime,
        lastReadTime: startTime,
        readTimes: 1,
        readDuration: duration,
      });
      reader.readHistory.push(newReadRecord);
      reader.readerProfile.readTimes += 1;
      reader.readerProfile.readDuration += duration;
      reader.readerProfile.score =
        reader.readerProfile.readTimes * w1 +
        reader.readerProfile.readDuration * w2;
      try {
        await reader.save();
        this.logger.info(
          `Success create new book ${bookID} read record for reader ${reader.username}`,
        );
        return newReadRecord;
      } catch (err) {
        this.logger.error(
          `Create new read record failed for reader ${reader.username}: ${err}`,
        );
        return null;
      }
    }
  }

  async getReadHistory(bookID: string): Promise<BookReadRecord[]> {
    const book = await this.bookModel
      .findById(bookID)
      .populate<{ readHistory: BookReadRecord[] }>('readHistory')
      .exec();
    if (!book) {
      this.logger.warn(`Can not find book ${bookID}, get read history failed`);
      return null;
    }
    //create log for this activity
    this.logger.info(`Success get book ${bookID} read history`);
    return book.readHistory;
  }

  async addBookComment(bookCommentDto: BookCommentInput): Promise<BookComment> {
    const book = await this.bookModel.findById(bookCommentDto.bookID);
    if (!book) {
      this.logger.warn(
        `Can not find book ${bookCommentDto.bookID}, adding book comment failed`,
      );
      return null;
    }
    //Create new comment in mongoDB BookComment document
    const now = new Date();
    const newComment = new this.bookCommentModel({
      book: bookCommentDto.bookID,
      readerName: bookCommentDto.readerName,
      title: bookCommentDto.title,
      comment: bookCommentDto.comment,
      createTime: now,
    });
    //Update mongoDB book document with new comment
    book.comments.push(newComment._id);
    await newComment.save();
    await book.save();
    //Create log for this activity
    this.logger.info(
      `Success add comment ${newComment._id} for book ${book._id}`,
    );
    return newComment;
  }

  async getBookComments(bookID): Promise<BookComment[]> {
    const book = await this.bookModel
      .findById(bookID)
      .populate<{ comments: BookComment[] }>('comments')
      .exec();
    if (!book) {
      this.logger.warn(
        `Can not find book ${bookID}, getting book comment failed`,
      );
      return null;
    }
    //Create log for this activity
    this.logger.info(`Success get comment for book ${book._id}`);
    return book.comments;
  }

  async addBookWish(bookWishDto: CreateWishInput): Promise<BookWish> {
    if (bookWishDto.bookTitle.trim() !== '') {
      //Check if this book wish already raised before
      if (
        await this.bookWishModel.findOne({
          bookTitle: bookWishDto.bookTitle,
          language: bookWishDto.language,
        })
      ) {
        this.logger.warn(
          `The book wish ${bookWishDto.bookTitle} was already in database.`,
        );
        return null;
      }
      const newBookWish = new this.bookWishModel({
        bookTitle: bookWishDto.bookTitle,
        language: bookWishDto.language,
        format: bookWishDto.format,
        creator: bookWishDto.creator,
        createTime: new Date(),
        status: 'Under Review',
      });
      await newBookWish.save();
      //Create log for this activity
      this.logger.info(`Success add book wish ${newBookWish._id}`);
      return newBookWish;
    }
  }

  async getUnfulfilWishList(): Promise<BookWish[]> {
    const WishList = await this.bookWishModel.find({
      status: { $in: ['Under Review', 'Approved'] },
    });
    //Create log for this activity
    this.logger.info(`Success get unfulfilled book wish list`);
    return WishList;
  }

  async getWishList(getWishListDto: GetWishlistInput): Promise<BookWish[]> {
    const WishList = await this.bookWishModel.find({
      creator: getWishListDto.readerName,
      format: getWishListDto.format,
    });
    //Create log for this activity
    this.logger.info(
      `Success get wish list for reader ${getWishListDto.readerName}`,
    );
    return WishList;
  }

  async getBookWish(bookWishID): Promise<BookWish> {
    const bookWish = await this.bookWishModel.findById(bookWishID);
    if (!bookWish) {
      this.logger.warn(
        `Can not find bookwish ${bookWishID}, getting book wish failed`,
      );
      return null;
    }
    //Create log for this activity
    this.logger.info(`Success get book wish for ${bookWish._id}`);
    return bookWish;
  }

  async updateWishStatus(updateWishStatusDto: UpdateWishInput) {
    const bookWish = await this.bookWishModel.findById(
      updateWishStatusDto.wishID,
    );
    bookWish.status = updateWishStatusDto.status;
    await bookWish.save();
    //Create log for this activity
    this.logger.info(`Success update status of book wish ${bookWish._id}`);
    return bookWish;
  }

  async delWish(wishID: string): Promise<BookWish> {
    const wish = await this.bookWishModel.findByIdAndDelete(wishID);
    if (wish) {
      this.logger.info(`Success delete the book wish ${wishID}`);
      return wish;
    }
  }

  async clearReadHistory(bookID) {
    const book = await this.bookModel.findById(bookID);
    book.readHistory.splice(0, book.readHistory.length);
    book.readTimes = 0;
    book.readDuration = 0;
    book.popularScore = book.initialScore;
    await book.save();
    await this.readRecordModel.findOneAndDelete({ book: bookID });
    this.logger.info(`Success deleted the read history of book ${bookID}`);
    return book.readHistory.length;
  }

  formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = this.fixZero(d.getMonth() + 1);
    const day = d.getDate();
    return year + '-' + month + '-' + day;
  }

  fixZero(num): string {
    let newNum = String(num);
    if (num < 10) {
      newNum = '0' + newNum;
    }
    return newNum;
  }
}
