import { Document } from 'mongoose';
import { Book, BookComment, BookReadRecord, BookWish } from '../../graphql';

export type BookDocument = Book & Document;

export type BookReadRecordDoc = BookReadRecord & Document;

export type BookCommentDoc = BookComment & Document;

export type BookWishDoc = BookWish & Document;
