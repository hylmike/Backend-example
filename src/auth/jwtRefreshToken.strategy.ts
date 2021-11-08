import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ReaderAuthService } from './readerAuth.service';
import { LibAuthService } from './libAuth.service';

@Injectable()
export class ReaderJwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'reader-jwt-refresh-token',
) {
  constructor(private readonly authService: ReaderAuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: { readerID: string }) {
    const refreshToken = request.cookies?.Refresh;
    // console.log(request.cookies.Refresh + '---' + payload.userID);
    if (refreshToken) {
      return this.authService.refreshTokenValidate(
        refreshToken,
        payload.readerID,
      );
    }
    return null;
  }
}

@Injectable()
export class LibJwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'lib-jwt-refresh-token',
) {
  constructor(private readonly authService: LibAuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: { libID: string }) {
    const refreshToken = request.cookies?.Refresh;
    // console.log(request.cookies.Refresh + '---' + payload.userID);
    if (refreshToken) {
      return this.authService.refreshTokenValidate(refreshToken, payload.libID);
    }
    return null;
  }
}
