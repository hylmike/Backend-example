import { UseGuards } from '@nestjs/common';
import { Context, Mutation, Resolver } from '@nestjs/graphql';
import { ReaderAuthService } from './readerAuth.service';
import { LibAuthService } from './libAuth.service';
import { ReaderGqlJwtAuthGuard } from './gql-jwt-auth.guard';
import { LibGqlJwtAuthGuard } from './gql-jwt-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly readerAuthService: ReaderAuthService,
    private readonly libAuthService: LibAuthService,
  ) { }

  @UseGuards(ReaderGqlJwtAuthGuard)
  @Mutation()
  async readerLogout(@Context() context: any) {
    return this.readerAuthService.logout(context.req);
  }

  @UseGuards(LibGqlJwtAuthGuard)
  @Mutation()
  async libLogout(@Context() context: any) {
    return this.libAuthService.logout(context.req);
  }
}
