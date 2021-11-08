import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ReaderSchema } from '../mongoSchema/reader.schema';
import { LibSchema } from '../mongoSchema/lib.schema';
import { ReaderAuthService } from './readerAuth.service';
import { ReaderJwtStrategy, LibJwtStrategy } from './jwt.strategy';
import {
  ReaderJwtRefreshTokenStrategy,
  LibJwtRefreshTokenStrategy,
} from './jwtRefreshToken.strategy';
import { ReaderLocalStrategy, LibLocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { LibAuthService } from './libAuth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_TIMER },
    }),
    MongooseModule.forFeature([
      { name: 'Reader', schema: ReaderSchema },
      { name: 'Lib', schema: LibSchema },
    ]),
  ],
  providers: [
    ReaderAuthService,
    LibAuthService,
    ReaderLocalStrategy,
    LibLocalStrategy,
    ReaderJwtStrategy,
    ReaderJwtRefreshTokenStrategy,
    LibJwtStrategy,
    LibJwtRefreshTokenStrategy,
    AuthResolver,
  ],
  exports: [ReaderAuthService, LibAuthService],
  controllers: [AuthController],
})
export class AuthModule {}
