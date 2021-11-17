
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface BookCommentInput {
    bookID: string;
    readerName: string;
    title?: Nullable<string>;
    comment?: Nullable<string>;
}

export interface ReadRecordInput {
    bookID: string;
    readerID: string;
    startTime: DateTime;
    currentPage: number;
    duration: number;
}

export interface CreateWishInput {
    bookTitle: string;
    language?: Nullable<string>;
    format: string;
    creator: string;
}

export interface GetWishlistInput {
    format: string;
    readerName: string;
}

export interface BookInput {
    bookTitle: string;
    isbnCode?: Nullable<string>;
    category: string;
    format: string;
    author?: Nullable<string>;
    language: string;
    publisher?: Nullable<string>;
    publishDate?: Nullable<string>;
    purchaseDate?: Nullable<string>;
    coverPic: string;
    bookFile: string;
    price?: Nullable<string>;
    desc?: Nullable<string>;
    keywords?: Nullable<string>;
    initialScore?: Nullable<string>;
    creator: string;
    isActive: string;
}

export interface SearchBookInput {
    format: string;
    category?: Nullable<string>;
    bookTitle?: Nullable<string>;
    author?: Nullable<string>;
    publishYear?: Nullable<string>;
}

export interface UpdateWishInput {
    wishID: string;
    status: string;
}

export interface RegLibInput {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface UpdateLibInput {
    username: string;
    email?: Nullable<string>;
    role?: Nullable<string>;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    phoneNumber?: Nullable<string>;
    isActive?: Nullable<string>;
}

export interface ChangePwdInput {
    username: string;
    currentPwd: string;
    newPwd: string;
}

export interface RegReaderInput {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthday: string;
    phoneNumber: string;
    homeAddress: string;
    province: string;
    postcode: string;
    securityQuestion: string;
    securityAnswer: string;
}

export interface UpdateReaderInput {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthday: string;
    phoneNumber: string;
    homeAddress: string;
    province: string;
    postcode: string;
    securityQuestion: string;
    securityAnswer: string;
}

export interface IQuery {
    sayHello(): Nullable<string> | Promise<Nullable<string>>;
    book(id: string): Nullable<Book> | Promise<Nullable<Book>>;
    findAllBooks(format: string): Nullable<Nullable<Book>[]> | Promise<Nullable<Nullable<Book>[]>>;
    searchBookList(searchBookData: SearchBookInput): Nullable<Nullable<Book>[]> | Promise<Nullable<Nullable<Book>[]>>;
    searchBook(sval: string): Nullable<Nullable<Book>[]> | Promise<Nullable<Nullable<Book>[]>>;
    findHotBooks(num: number): Nullable<Nullable<Book>[]> | Promise<Nullable<Nullable<Book>[]>>;
    sumBookInventory(): Nullable<BookInventory> | Promise<Nullable<BookInventory>>;
    getReadHistory(bookID: string): Nullable<Nullable<BookReadRecord>[]> | Promise<Nullable<Nullable<BookReadRecord>[]>>;
    getBookComments(bookID: string): Nullable<Nullable<BookComment>[]> | Promise<Nullable<Nullable<BookComment>[]>>;
    getUnfulfilWishList(): Nullable<Nullable<BookWish>[]> | Promise<Nullable<Nullable<BookWish>[]>>;
    getWishList(getWishData: GetWishlistInput): Nullable<Nullable<BookWish>[]> | Promise<Nullable<Nullable<BookWish>[]>>;
    getBookWish(wishID: string): Nullable<BookWish> | Promise<Nullable<BookWish>>;
    allLibrarians(): Nullable<Nullable<Lib>[]> | Promise<Nullable<Nullable<Lib>[]>>;
    allAdmins(): Nullable<Nullable<Lib>[]> | Promise<Nullable<Nullable<Lib>[]>>;
    lib(id: string): Nullable<Lib> | Promise<Nullable<Lib>>;
    reader(id: string): Nullable<Reader> | Promise<Nullable<Reader>>;
    allReaders(): Nullable<Nullable<Reader>[]> | Promise<Nullable<Nullable<Reader>[]>>;
}

export interface IMutation {
    readerLogout(): Nullable<Reader> | Promise<Nullable<Reader>>;
    libLogout(): Nullable<Lib> | Promise<Nullable<Lib>>;
    registerBook(regBookData: BookInput): Nullable<Book> | Promise<Nullable<Book>>;
    updateBook(updateBookData: BookInput): Nullable<Book> | Promise<Nullable<Book>>;
    delBook(id: string): Nullable<Book> | Promise<Nullable<Book>>;
    addReadRecord(recordData: ReadRecordInput): Nullable<BookReadRecord> | Promise<Nullable<BookReadRecord>>;
    addBookComment(bookCommentData: BookCommentInput): Nullable<BookComment> | Promise<Nullable<BookComment>>;
    addBookWish(addWishData: CreateWishInput): Nullable<BookWish> | Promise<Nullable<BookWish>>;
    updateWishStatus(updateWishData: UpdateWishInput): Nullable<BookWish> | Promise<Nullable<BookWish>>;
    delWish(id: string): Nullable<BookWish> | Promise<Nullable<BookWish>>;
    registerLib(regLibData: RegLibInput): Nullable<Lib> | Promise<Nullable<Lib>>;
    updateLib(updateLibData: UpdateLibInput): Nullable<Lib> | Promise<Nullable<Lib>>;
    changeLibPwd(changeLibPwdData: ChangePwdInput): Nullable<Lib> | Promise<Nullable<Lib>>;
    delLib(id: string): Nullable<Lib> | Promise<Nullable<Lib>>;
    registerReader(regReaderData: RegReaderInput): Nullable<Reader> | Promise<Nullable<Reader>>;
    updateReader(updateReaderData: UpdateReaderInput): Nullable<Reader> | Promise<Nullable<Reader>>;
    changeReaderPwd(changeReaderPwdData: ChangePwdInput): Nullable<Reader> | Promise<Nullable<Reader>>;
    delReader(id: string): Nullable<Reader> | Promise<Nullable<Reader>>;
}

export interface Book {
    _id: string;
    bookTitle: string;
    isbnCode: string;
    category: string;
    format: string;
    author: string;
    language: string;
    publisher: string;
    publishDate: DateTime;
    purchaseDate: DateTime;
    price: number;
    coverPic: string;
    bookFile: string;
    desc: string;
    keywords: string;
    isActive: boolean;
    createDate: DateTime;
    creator: string;
    readTimes: number;
    readDuration: number;
    initialScore: number;
    popularScore: number;
    comments?: Nullable<Nullable<string>[]>;
    readHistory?: Nullable<Nullable<string>[]>;
}

export interface BookReadRecord {
    _id: string;
    book: string;
    readerID: string;
    startTime: DateTime;
    duration: number;
}

export interface BookComment {
    _id: string;
    book: string;
    readerName: string;
    title: string;
    comment: string;
    createTime: DateTime;
}

export interface BookWish {
    _id: string;
    bookTitle: string;
    language: string;
    format: string;
    creator: string;
    createTime: DateTime;
    status: string;
}

export interface BookInventory {
    category: string;
    count: number;
}

export interface Lib {
    _id: string;
    username: string;
    password: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    registerDate: DateTime;
    currentRefreshToken?: Nullable<string>;
    isActive: boolean;
}

export interface ReaderProfile {
    _id: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthday: DateTime;
    phoneNumber: string;
    address: Address;
    readTimes: number;
    readDuration: number;
    score: number;
    securityQuestion: string;
    securityAnswer: string;
}

export interface Reader {
    _id: string;
    username: string;
    password: string;
    email: string;
    isActive: boolean;
    registerDate: DateTime;
    currentRefreshToken?: Nullable<string>;
    favouriteBook?: Nullable<Nullable<FavouriteBook>[]>;
    readerProfile: ReaderProfile;
    readHistory?: Nullable<Nullable<ReaderReadHistory>[]>;
}

export interface ReaderReadHistory {
    _id: string;
    bookID: string;
    currentPage: number;
    startTime: DateTime;
    lastReadTime: DateTime;
    readTimes: number;
    readDuration: number;
}

export interface FavouriteBook {
    bookID: string;
    createDate: DateTime;
}

export interface Address {
    homeAddress: string;
    province: string;
    postcode: string;
}

export interface AccessToken {
    tokenInfo: string;
}

export interface Token {
    _id: string;
    readerName: string;
    email: string;
    token: string;
    createTime: DateTime;
}

export type DateTime = Date;
type Nullable<T> = T | null;
