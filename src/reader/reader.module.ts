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
import { BookSchema } from '../mongoSchema/book.schema';

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
