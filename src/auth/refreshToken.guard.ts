import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ReaderRefreshTokenAuthGuard extends AuthGuard(
  'reader-jwt-refresh-token',
) {}

@Injectable()
export class LibRefreshTokenAuthGuard extends AuthGuard(
  'lib-jwt-refresh-token',
) {}
