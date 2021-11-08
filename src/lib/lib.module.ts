import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LibService } from './lib.service';
import { LibResolver } from './lib.resolver';
import { LibSchema } from 'src/mongoSchema/lib.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Lib', schema: LibSchema }])],
  providers: [LibService, LibResolver],
})
export class LibModule {}
