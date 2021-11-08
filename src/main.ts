import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.use(helmet());
  app.use(csurf());
  app.use(cookieParser());
}
bootstrap();
