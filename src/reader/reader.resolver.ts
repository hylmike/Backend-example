import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import {
  BothGqlJwtAuthGuard,
  ReaderGqlJwtAuthGuard,
} from '../auth/gql-jwt-auth.guard';
import {
  Reader,
  RegReaderInput,
  ChangePwdInput,
  UpdateReaderInput,
  FavorBookInput,
  ReaderReadHistory,
} from '../graphql';
import { Book } from '../mongoSchema/book.schema';
import { ReaderService } from './reader.service';

@Resolver('Reader')
export class ReaderResolver {
  constructor(private readonly readerService: ReaderService) {}

  @UseGuards(BothGqlJwtAuthGuard)
  @Query('reader')
  async getReader(@Args('id') id: string): Promise<Reader> {
    return this.readerService.getReader(id);
  }

  @Query('allReaders')
  async getAllReaders(): Promise<Reader[]> {
    return this.readerService.getAllReaders();
  }

  @Query('topReaders')
  async getTopReaders(@Args('num') num: string): Promise<Reader[]> {
    return this.readerService.getTopN(num);
  }

  @Mutation()
  async registerReader(
    @Args('regReaderData') regReaderData: RegReaderInput,
  ): Promise<Reader> {
    return this.readerService.register(regReaderData);
  }

  @UseGuards(ReaderGqlJwtAuthGuard)
  @Mutation()
  async updateReader(
    @Args('updateReaderData') updateReaderData: UpdateReaderInput,
  ): Promise<Reader> {
    return this.readerService.updateReader(updateReaderData);
  }

  @UseGuards(ReaderGqlJwtAuthGuard)
  @Mutation()
  changeReaderPwd(
    @Args('changeReaderPwdData') changeReaderPwdData: ChangePwdInput,
  ) {
    return this.readerService.changePwd(changeReaderPwdData);
  }

  @Mutation()
  async delReader(@Args('id') id: string): Promise<Reader> {
    return this.readerService.delReader(id);
  }

  @Mutation()
  async deaReader(@Args('id') id: string): Promise<Reader> {
    return this.readerService.deaReader(id);
  }

  @Mutation()
  async actReader(@Args('id') id: string): Promise<Reader> {
    return this.readerService.actReader(id);
  }

  @Mutation()
  async addFavorBook(
    @Args('favorBookData') favorBookData: FavorBookInput,
  ): Promise<Reader> {
    return this.readerService.addFavourBook(favorBookData);
  }

  @ResolveField('favorBooks')
  async getFavorBookList(@Parent() reader: Reader): Promise<Book[]> {
    const { _id: id } = reader;
    return this.readerService.getFavourBookList(id);
  }

  @Mutation()
  async delFavorBook(
    @Args('favorBookData') favorBookData: FavorBookInput,
  ): Promise<Reader> {
    return this.readerService.delFavourBook(favorBookData);
  }

  @ResolveField('readHistory')
  async getReadHistory(@Parent() reader: Reader): Promise<ReaderReadHistory[]> {
    const { _id: readerID } = reader;
    return this.readerService.getReadHistory(readerID);
  }
}
