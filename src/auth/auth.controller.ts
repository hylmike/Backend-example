import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ReaderAuthService } from './readerAuth.service';
import { LibLocalAuthGuard, ReaderLocalAuthGuard } from './local-auth.guard';
import {
  LibRefreshTokenAuthGuard,
  ReaderRefreshTokenAuthGuard,
} from './refreshToken.guard';
import { LibAuthService } from './libAuth.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly readerAuthService: ReaderAuthService,
    private readonly libAuthService: LibAuthService,
  ) {}

  @UseGuards(ReaderLocalAuthGuard)
  @Post('/reader/login')
  readerLogin(@Request() req) {
    return this.readerAuthService.login(req);
  }

  @UseGuards(LibLocalAuthGuard)
  @Post('/lib/login')
  libLogin(@Request() req) {
    return this.libAuthService.login(req, 'librarian');
  }

  @UseGuards(LibLocalAuthGuard)
  @Post('/admin/login')
  adminLogin(@Request() req) {
    return this.libAuthService.login(req, 'admin');
  }

  @UseGuards(ReaderRefreshTokenAuthGuard)
  @Post('/reader/refreshtoken')
  readerRefreshToken(@Request() req) {
    return this.readerAuthService.tokenRefresh(req);
  }

  @UseGuards(LibRefreshTokenAuthGuard)
  @Post('/lib/refreshtoken')
  libRefreshToken(@Request() req) {
    return this.libAuthService.tokenRefresh(req);
  }
}
