import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Reader } from '../graphql';
import { ReaderDocument } from '../reader/schema/readerDoc';
import { Logger } from 'winston';

@Injectable()
export class ReaderAuthService {
  constructor(
    @InjectModel('Reader') private readonly readerModel: Model<ReaderDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly jwtService: JwtService,
  ) {}

  async validateReader(username: string, password: string) {
    const reader = await this.getByName(username);
    const match = await bcrypt.compare(password, reader.password);
    if (match) {
      reader.password = null;
      if (reader.isActive) {
        this.logger.info(
          `reader ${reader.username} username & password validation passed`,
        );
        return reader;
      } else {
        this.logger.error('The reader is inactive, login rejected');
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            message: 'Inactive reader, login rejected',
          },
          401,
        );
      }
    }
    return null;
  }

  async getByName(username: string): Promise<Reader> {
    const reader = await this.readerModel
      .findOne({ username: username })
      .select('+password')
      .exec();
    if (!reader) {
      this.logger.info(`Can't find reader ${username} in database`);
      return null;
    }
    return reader;
  }

  async getById(readerID: string): Promise<Reader> {
    const reader = await this.readerModel.findById(readerID);
    if (!reader) {
      this.logger.warn(`Can't find reader ${readerID} in database`);
      return null;
    }
    return reader;
  }

  async login(request) {
    const readerID = request.user._id;
    const accessToken = this.getJwtAccessToken(readerID);
    const refreshToken = this.getCookieJwtRefreshToken(readerID);
    await this.setRefreshToken(refreshToken[1], readerID);
    request.res.setHeader('Set-Cookie', refreshToken[0]);
    this.logger.info(`Success login for reader ${request.user.username}`);
    return { accessToken: accessToken };
  }

  async getRefreshTokenById(readerID: string) {
    const reader = await this.readerModel
      .findById(readerID)
      .select('+currentRefreshToken')
      .exec();
    if (!reader) {
      this.logger.warn(
        `Could not find the reader ${readerID} when getting refresh token`,
      );
      return null;
    }
    return reader;
  }

  getJwtAccessToken(readerID: string) {
    const payload = { readerID };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_TIMER,
    });
    this.logger.info(`Success setup access token for reader ${readerID}`);
    return accessToken;
  }

  async setRefreshToken(refresh_token: string, readerID: string) {
    const reader = await this.getRefreshTokenById(readerID);
    const hash_token = await bcrypt.hash(refresh_token, 10);
    reader.currentRefreshToken = hash_token;
    try {
      const UpdateReader = await reader.save();
      this.logger.info(`Success save refreshtoken in database`);
      return UpdateReader.username;
    } catch (err) {
      this.logger.error(`Saving refresh token failed for ${readerID}: ${err}`);
      return null;
    }
  }

  public getCookieJwtRefreshToken(readerID: string) {
    const payload = { readerID };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_TIMER,
    });
    const maxAge = +process.env.REFRESH_TOKEN_TIMER.slice(0, -1);
    const cookieRefreshToken = `Refresh=${refreshToken}; HttpOnly; Path=/api/auth/reader/refreshtoken; Max-Age=${maxAge}`;
    this.logger.info(`Success setup refresh token for reader ${readerID}`);
    return [cookieRefreshToken, refreshToken];
  }

  async refreshTokenValidate(
    refreshToken: string,
    readerID: string,
  ): Promise<Reader> {
    const reader = await this.getRefreshTokenById(readerID);
    if (!reader) {
      this.logger.warn(
        `Could not find the reader ${readerID} in refreshtoken validation`,
      );
      return null;
    }
    const match = await bcrypt.compare(
      refreshToken,
      reader.currentRefreshToken,
    );
    if (match) {
      this.logger.info(
        `Refresh token validation for reader ${readerID} passed`,
      );
      return reader;
    }
    this.logger.warn(
      `Mismatch refresh token, validation for reader ${readerID} failed`,
    );
    return null;
  }

  tokenRefresh(request) {
    const readerID = request.user._id;
    const accessToken = this.getJwtAccessToken(readerID);
    this.logger.info(`Success refresh  accessToken for reader ${readerID}`);
    return { access_token: accessToken };
  }

  async logout(request) {
    const readerID = request.user._id;
    const reader = await this.readerModel.findOneAndUpdate(
      { _id: readerID },
      { currentRefreshToken: null },
    );
    const deleteCookie = 'Refresh=; HttpOnly; path=/api; Max-Age=0';
    request.res.setHeader('Set-Cookie', deleteCookie);
    this.logger.info(`Success logout for reader ${readerID}`);
    return reader;
  }
}
