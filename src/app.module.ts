import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLISODateTime, GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { WinstonModule } from 'nest-winston';
import { join } from 'path';
import * as winston from 'winston';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './filter/http-excetption.filter';
import { AppResolver } from './app.resolver';
import { ReaderModule } from './reader/reader.module';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { LibModule } from './lib/lib.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri:
          process.env.NODE_ENV === 'production'
            ? process.env.MONGO_PROD_URI
            : process.env.NODE_ENV === 'development'
            ? process.env.MONGO_DEV_URI
            : process.env.MONGO_TEST_URI,
        useNewUrlParser: true,
      }),
    }),
    GraphQLModule.forRoot({
      typePaths: ['./src/**/*.graphql'],
      resolvers: { DateTime: GraphQLISODateTime },
      context: ({ req }) => ({ req }),
    }),
    WinstonModule.forRoot({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.File({
          filename: 'combined.log',
          level: 'info',
        }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'uploadfiles'),
      serveRoot: '/uploadfiles',
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ReaderModule,
    AuthModule,
    BookModule,
    LibModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService,
    AppResolver,
  ],
})
export class AppModule {}
