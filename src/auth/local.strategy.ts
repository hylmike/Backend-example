import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReaderAuthService } from './readerAuth.service';
import { LibAuthService } from './libAuth.service';

@Injectable()
export class ReaderLocalStrategy extends PassportStrategy(
  Strategy,
  'reader-local',
) {
  constructor(private readonly authService: ReaderAuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const reader = await this.authService.validateReader(username, password);
    if (!reader) {
      throw new HttpException(
        'Incorrect username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return reader;
  }
}

@Injectable()
export class LibLocalStrategy extends PassportStrategy(Strategy, 'lib-local') {
  constructor(private readonly authService: LibAuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const lib = await this.authService.validateLib(username, password);
    if (!lib) {
      throw new HttpException(
        'Incorrect username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return lib;
  }
}
