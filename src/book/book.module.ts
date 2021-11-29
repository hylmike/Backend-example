import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookResolver } from './book.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BookCommentSchema,
  BookReadRecordSchema,
  BookSchema,
  BookWishSchema,
} from '../mongoSchema/book.schema';
import {
  ReaderReadHistorySchema,
  ReaderSchema,
} from '../mongoSchema/reader.schema';
import { BookController } from './book.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: process.env.BOOK_UPLOAD_FOLDER,
        filename: (req, file, cb) => {
          return cb(null, file.originalname);
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: 'Book', schema: BookSchema },
      { name: 'BookReadRecord', schema: BookReadRecordSchema },
      { name: 'BookComment', schema: BookCommentSchema },
      { name: 'BookWish', schema: BookWishSchema },
      { name: 'Reader', schema: ReaderSchema },
      { name: 'ReaderReadHistory', schema: ReaderReadHistorySchema },
    ]),
  ],
  providers: [BookService, BookResolver],
  controllers: [BookController],
})
export class BookModule {}
