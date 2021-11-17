import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LibGqlJwtAuthGuard } from 'src/auth/gql-jwt-auth.guard';

import { ChangePwdInput, Lib, RegLibInput, UpdateLibInput } from '../graphql';
import { LibService } from './lib.service';

@Resolver()
export class LibResolver {
  constructor(private readonly libService: LibService) {}

  @Query('allLibrarians')
  async getAllLib(): Promise<Lib[]> {
    return this.libService.getAllLibrarian();
  }

  @Query('allAdmins')
  async getAllAdmin(): Promise<Lib[]> {
    return this.libService.getAllAdmin();
  }

  @UseGuards(LibGqlJwtAuthGuard)
  @Query('lib')
  async getLib(@Args('id') id: string): Promise<Lib> {
    return this.libService.getProfile(id);
  }

  @Mutation()
  async registerLib(@Args('regLibData') regLibData: RegLibInput): Promise<Lib> {
    return this.libService.register(regLibData);
  }

  @UseGuards(LibGqlJwtAuthGuard)
  @Mutation()
  async updateLib(
    @Args('updateLibData') updateLibData: UpdateLibInput,
  ): Promise<Lib> {
    return this.libService.updateProfile(updateLibData);
  }

  @UseGuards(LibGqlJwtAuthGuard)
  @Mutation()
  async changeLibPwd(
    @Args('changeLibPwdData') changeLibPwdData: ChangePwdInput,
  ): Promise<Lib> {
    return this.libService.changePwd(changeLibPwdData);
  }

  @UseGuards(LibGqlJwtAuthGuard)
  @Mutation()
  async delLib(@Args('id') id: string): Promise<Lib> {
    return this.libService.delLib(id);
  }
}
