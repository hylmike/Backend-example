import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ReaderLocalAuthGuard extends AuthGuard('reader-local') {}

@Injectable()
export class LibLocalAuthGuard extends AuthGuard('lib-local') {}
