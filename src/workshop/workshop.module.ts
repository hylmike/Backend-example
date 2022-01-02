import { Module } from '@nestjs/common';
import { WorkshopService } from './workshop.service';
import { WorkshopResolver } from './workshop.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import {
  SubscriberSchema,
  WorkshopSchema,
} from 'src/mongoSchema/workshop.schema';
import { ReaderSchema } from '../mongoSchema/reader.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { WorkshopController } from './workshop.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: process.env.OTHER_UPLOAD_FOLDER,
        filename: (req, file, cb) => {
          return cb(null, file.originalname);
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: 'Workshop', schema: WorkshopSchema },
      { name: 'Subscriber', schema: SubscriberSchema },
      { name: 'Reader', schema: ReaderSchema },
    ]),
    AuthModule,
  ],
  providers: [WorkshopService, WorkshopResolver],
  controllers: [WorkshopController],
})
export class WorkshopModule {}
