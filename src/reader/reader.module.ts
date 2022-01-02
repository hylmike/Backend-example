import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ReaderSchema,
  ReaderProfileSchema,
  ReaderReadHistorySchema,
} from '../mongoSchema/reader.schema';
import { AuthModule } from '../auth/auth.module';
import { ReaderService } from './reader.service';
import { ReaderResolver } from './reader.resolver';
import { BookCommentSchema, BookReadRecordSchema, BookSchema, BookWishSchema } from '../mongoSchema/book.schema';
import { BookService } from 'src/book/book.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Reader', schema: ReaderSchema },
      { name: 'ReaderProfile', schema: ReaderProfileSchema },
      { name: 'ReaderReadHistory', schema: ReaderReadHistorySchema },
      { name: 'Book', schema: BookSchema },
    ]),
    AuthModule,
  ],
  providers: [ReaderService, ReaderResolver],
})
export class ReaderModule { }
