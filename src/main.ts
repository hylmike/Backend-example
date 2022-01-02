import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.APP_URL_PROD
        : process.env.APP_URL_DEV,
    credentials: true,
  });
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cookieParser());
  await app.listen(process.env.PORT);
}
bootstrap();
