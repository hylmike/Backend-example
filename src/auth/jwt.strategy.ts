import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import { Reader, Lib } from '../graphql';
import { ReaderAuthService } from './readerAuth.service';
import { LibAuthService } from './libAuth.service';

@Injectable()
export class ReaderJwtStrategy extends PassportStrategy(
  Strategy,
  'reader-jwt',
) {
  constructor(private readonly authService: ReaderAuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: { readerID: string }): Promise<Reader | undefined> {
    return this.authService.getById(payload.readerID);
  }
}

@Injectable()
export class LibJwtStrategy extends PassportStrategy(Strategy, 'lib-jwt') {
  constructor(private readonly authService: LibAuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: { libID: string }): Promise<Lib | undefined> {
    return this.authService.getById(payload.libID);
  }
}
