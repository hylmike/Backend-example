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

@Module({
  imports: [
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
})
export class BookModule {}
