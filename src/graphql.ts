
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
    startTime: string;
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
    isbnCode: string;
    category: string;
    format: string;
    author: string;
    language: string;
    publisher: string;
    publishDate: string;
    purchaseDate: string;
    coverPic: string;
    bookFile: string;
    price: string;
    desc: string;
    keywords: string;
    initialScore: string;
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

export interface FavorBookInput {
    readerID: string;
    bookID: string;
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

export interface RegWorkshopInput {
    topic: string;
    place: string;
    organizer: string;
    startTime: string;
    duration: string;
    poster: string;
    creator: string;
    remark: string;
}

export interface SubWorkshopInput {
    workshopID: string;
    readerID: string;
}

export interface UpdateWorkshopInput {
    id: string;
    topic: string;
    place: string;
    organizer: string;
    startTime: string;
    duration: string;
    poster: string;
    remark: string;
}

export interface IQuery {
    sayHello(): Nullable<string> | Promise<Nullable<string>>;
    book(id: string): Nullable<Book> | Promise<Nullable<Book>>;
    findAllBooks(format: string): Book[] | Promise<Book[]>;
    searchBookList(searchBookData: SearchBookInput): Nullable<Book>[] | Promise<Nullable<Book>[]>;
    searchBook(sval: string): Nullable<Book>[] | Promise<Nullable<Book>[]>;
    findHotBooks(num: number): Book[] | Promise<Book[]>;
    sumBookInventory(): Nullable<BookInventory> | Promise<Nullable<BookInventory>>;
    getReadHistory(bookID: string): Nullable<BookReadRecord>[] | Promise<Nullable<BookReadRecord>[]>;
    getBookComments(bookID: string): Nullable<BookComment>[] | Promise<Nullable<BookComment>[]>;
    getUnfulfilWishList(): Nullable<BookWish>[] | Promise<Nullable<BookWish>[]>;
    getWishList(getWishData: GetWishlistInput): Nullable<BookWish>[] | Promise<Nullable<BookWish>[]>;
    getBookWish(wishID: string): Nullable<BookWish> | Promise<Nullable<BookWish>>;
    allLibrarians(): Nullable<Nullable<Lib>[]> | Promise<Nullable<Nullable<Lib>[]>>;
    allAdmins(): Nullable<Nullable<Lib>[]> | Promise<Nullable<Nullable<Lib>[]>>;
    lib(id: string): Nullable<Lib> | Promise<Nullable<Lib>>;
    reader(id: string): Nullable<Reader> | Promise<Nullable<Reader>>;
    allReaders(): Nullable<Reader>[] | Promise<Nullable<Reader>[]>;
    topReaders(num: number): Nullable<Reader>[] | Promise<Nullable<Reader>[]>;
    favorBookList(id: string): Nullable<Book>[] | Promise<Nullable<Book>[]>;
    workshop(id: string): Nullable<Workshop> | Promise<Nullable<Workshop>>;
    getWorkshopList(num: number): Nullable<Workshop>[] | Promise<Nullable<Workshop>[]>;
    getSubscriber(id: string): Nullable<Subscriber> | Promise<Nullable<Subscriber>>;
    getSubWorkshops(readerID: string): Nullable<Workshop>[] | Promise<Nullable<Workshop>[]>;
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
    deaReader(id: string): Nullable<Reader> | Promise<Nullable<Reader>>;
    actReader(id: string): Nullable<Reader> | Promise<Nullable<Reader>>;
    delReader(id: string): Nullable<Reader> | Promise<Nullable<Reader>>;
    addFavorBook(favorBookData: FavorBookInput): Nullable<Reader> | Promise<Nullable<Reader>>;
    delFavorBook(favorBookData: FavorBookInput): Nullable<Reader> | Promise<Nullable<Reader>>;
    regWorkshop(regWorkshopData: RegWorkshopInput): Nullable<Workshop> | Promise<Nullable<Workshop>>;
    updateWorkshop(updateWorkshopData: UpdateWorkshopInput): Nullable<Workshop> | Promise<Nullable<Workshop>>;
    delWorkshop(id: string): Nullable<Workshop> | Promise<Nullable<Workshop>>;
    subWorkshop(subWorkshopData: SubWorkshopInput): Nullable<Subscriber> | Promise<Nullable<Subscriber>>;
    unsubWorkshop(id: string): Nullable<Subscriber> | Promise<Nullable<Subscriber>>;
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
    comments: Nullable<BookComment>[];
    readHistory: Nullable<BookReadRecord>[];
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
    favorBooks?: Nullable<Nullable<Book>[]>;
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
    book?: Nullable<Book>;
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

export interface Subscriber {
    _id: string;
    workshop: string;
    readerID: string;
    subscribeTime: DateTime;
    reader?: Nullable<Reader>;
}

export interface Workshop {
    _id: string;
    topic: string;
    place: string;
    organizer: string;
    subscriber: Nullable<Subscriber>[];
    startTime: DateTime;
    duration: number;
    poster: string;
    creator: string;
    createTime: DateTime;
    remark: string;
}

export type DateTime = Date;
type Nullable<T> = T | null;
