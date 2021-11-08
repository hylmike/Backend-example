import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Lib } from '../graphql';
import { LibDocument } from '../lib/schema/libDoc';
import { Logger } from 'winston';

@Injectable()
export class LibAuthService {
  constructor(
    @InjectModel('Lib') private readonly libModel: Model<LibDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly jwtService: JwtService,
  ) { }

  async validateLib(username: string, password: string) {
    const lib = await this.getByName(username);
    const match = await bcrypt.compare(password, lib.password);
    if (match) {
      lib.password = null;
      if (lib.isActive) {
        this.logger.info(
          `${lib.role} ${lib.username} username & password validation passed`,
        );
        return lib;
      } else {
        this.logger.error(`The ${username} is inactive, login rejected`);
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            message: `Inactive ${lib.role}, login rejected`,
          },
          401,
        );
      }
    }
    return null;
  }

  async getByName(username: string): Promise<Lib> {
    const lib = await this.libModel
      .findOne({ username: username })
      .select('+password')
      .exec();
    if (!lib) {
      this.logger.info(`Can't find ${lib.role} ${username} in database`);
      return null;
    }
    return lib;
  }

  async getById(libID: string): Promise<Lib> {
    const lib = await this.libModel.findById(libID);
    if (!lib) {
      this.logger.warn(`Can't find ${lib.role} ${libID} in database`);
      return null;
    }
    return lib;
  }

  async login(request, requiredRole: string) {
    const libID = request.user._id;
    const role = request.user.role;
    if (role.toLowerCase() !== requiredRole) {
      this.logger.warn(`User does not have ${requiredRole} role, login failed`);
      return null;
    }
    const accessToken = this.getJwtAccessToken(libID);
    const refreshToken = this.getCookieJwtRefreshToken(libID);
    await this.setRefreshToken(refreshToken[1], libID);
    request.res.setHeader('Set-Cookie', refreshToken[0]);
    this.logger.info(`Success login for ${role} ${request.user.username}`);
    return { accessToken: accessToken };
  }

  async getRefreshTokenById(libID: string) {
    const lib = await this.libModel
      .findById(libID)
      .select('+refreshToken')
      .exec();
    if (!lib) {
      this.logger.warn(
        `Could not find the lib ${libID} when getting refresh token`,
      );
      return null;
    }
    return lib;
  }

  getJwtAccessToken(libID: string) {
    const payload = { libID };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_TIMER,
    });
    this.logger.info(`Success setup access token for lib ${libID}`);
    return accessToken;
  }

  async setRefreshToken(refresh_token: string, libID: string) {
    const lib = await this.getRefreshTokenById(libID);
    const hash_token = await bcrypt.hash(refresh_token, 10);
    lib.currentRefreshToken = hash_token;
    try {
      const Updatelib = await lib.save();
      this.logger.info(`Success save refreshtoken in database`);
      return Updatelib.username;
    } catch (err) {
      this.logger.error(`Saving refresh token failed for ${libID}: ${err}`);
      return null;
    }
  }

  public getCookieJwtRefreshToken(libID: string) {
    const payload = { libID };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_TIMER,
    });
    const maxAge = +process.env.REFRESH_TOKEN_TIMER.slice(0, -1);
    const cookieRefreshToken = `Refresh=${refreshToken}; HttpOnly; Path=/api/auth/refreshtoken; Max-Age=${maxAge}`;
    this.logger.info(`Success setup refresh token for lib ${libID}`);
    return [cookieRefreshToken, refreshToken];
  }

  async refreshTokenValidate(
    refreshToken: string,
    libID: string,
  ): Promise<Lib> {
    const lib = await this.getRefreshTokenById(libID);
    if (!lib) {
      this.logger.warn(
        `Could not find the ${lib.role} ${libID} in refreshtoken validation`,
      );
      return null;
    }
    const match = await bcrypt.compare(refreshToken, lib.currentRefreshToken);
    if (match) {
      this.logger.info(
        `Refresh token validation for ${lib.role} ${libID} passed`,
      );
      return lib;
    }
    this.logger.warn(
      `Mismatch refresh token, validation for ${lib.role} ${libID} failed`,
    );
    return null;
  }

  tokenRefresh(request) {
    const libID = request.user._id;
    const accessToken = this.getJwtAccessToken(libID);
    this.logger.info(`Success refresh  accessToken for lib ${libID}`);
    return { access_token: accessToken };
  }

  async logout(request) {
    const libID = request.user._id;
    await this.libModel.updateOne(
      { _id: libID },
      { currentRefreshToken: null },
    );
    const deleteCookie = 'Refresh=; HttpOnly; path=/api; Max-Age=0';
    request.res.setHeader('Set-Cookie', deleteCookie);
    this.logger.info(`Success logout for ${request.user.role} ${libID}`);
    return libID;
  }
}
