import {
  Args,
  Resolver,
  Query,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import {
  BookCommentInput,
  BookInput,
  CreateWishInput,
  GetWishlistInput,
  ReadRecordInput,
  SearchBookInput,
  UpdateWishInput,
  BookInventory,
} from '../graphql';
import {
  Book,
  BookWish,
  BookComment,
  BookReadRecord,
} from '../mongoSchema/book.schema';
import { BookService } from './book.service';

@Resolver('Book')
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Query('book')
  async getBook(@Args('id') id: string): Promise<Book> {
    return this.bookService.findBook(id);
  }

  @Query()
  async findAllBooks(@Args('format') format: string): Promise<Book[]> {
    return this.bookService.findAllBook(format);
  }

  @Query()
  async searchBookList(
    @Args('searchBookData') searchBookData: SearchBookInput,
  ): Promise<Book[]> {
    return this.bookService.findBookList(searchBookData);
  }

  @Query()
  async searchBook(@Args('sval') sval: string): Promise<Book[]> {
    return this.bookService.searchBook(sval);
  }

  @Query()
  async findHotBooks(@Args('num') num: number): Promise<Book[]> {
    return this.bookService.findHotBooks(num);
  }

  @Query()
  async sumBookInventory(): Promise<BookInventory[]> {
    return this.bookService.sumInventory();
  }

  @Mutation()
  async registerBook(
    @Args('regBookData') regBookData: BookInput,
  ): Promise<Book> {
    return this.bookService.register(regBookData);
  }

  @Mutation()
  async updateBook(
    @Args('updateBookData') updateBookData: BookInput,
  ): Promise<Book> {
    return this.bookService.updateBookInfo(updateBookData);
  }

  @Mutation()
  async delBook(@Args('id') id: string): Promise<Book> {
    return this.bookService.delBook(id);
  }

  @Mutation()
  async addReadRecord(
    @Args('recordData') recordData: ReadRecordInput,
  ): Promise<BookReadRecord> {
    return this.bookService.addReadRecord(recordData);
  }

  @ResolveField('readHistory')
  async getReadHistory(@Parent() book: Book): Promise<BookReadRecord[]> {
    const { _id: bookID } = book;
    return this.bookService.getReadHistory(bookID);
  }

  @Mutation()
  async addBookComment(
    @Args('bookCommentData') bookCommentData: BookCommentInput,
  ): Promise<BookComment> {
    return this.bookService.addBookComment(bookCommentData);
  }

  @ResolveField('comments')
  async getBookComments(@Parent() book: Book): Promise<BookComment[]> {
    const { _id: bookID } = book;
    return this.bookService.getBookComments(bookID);
  }

  @Mutation()
  async addBookWish(
    @Args('addWishData') addWishData: CreateWishInput,
  ): Promise<BookWish> {
    return this.bookService.addBookWish(addWishData);
  }

  @Query()
  async getUnfulfilWishList(): Promise<BookWish[]> {
    return this.bookService.getUnfulfilWishList();
  }

  @Query()
  async getWishList(
    @Args('getWishData') getWishData: GetWishlistInput,
  ): Promise<BookWish[]> {
    return this.bookService.getWishList(getWishData);
  }

  @Query()
  async getBookWish(@Args('id') id: string): Promise<BookWish> {
    return this.bookService.getBookWish(id);
  }

  @Mutation()
  async updateWishStatus(
    @Args('updateWishData') updateWishData: UpdateWishInput,
  ): Promise<BookWish> {
    return this.bookService.updateWishStatus(updateWishData);
  }

  @Mutation()
  async delWish(@Args('id') id: string): Promise<BookWish> {
    return this.bookService.delWish(id);
  }
}
