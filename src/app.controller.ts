import { Controller, Get, Inject } from '@nestjs/common';
import { utilities, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as winston from 'winston';
import { Logger } from 'winston';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    if (process.env.NODE_ENV !== 'production') {
      logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            utilities.format.nestLike(),
          ),
        }),
      );
    }
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
