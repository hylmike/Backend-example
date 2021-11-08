import { Document } from 'mongoose';
import { Reader, ReaderProfile, ReaderReadHistory } from '../../graphql';

export type ReaderDocument = Reader & Document;

export type ReaderProDocument = ReaderProfile & Document;

export type ReaderReadHisDocument = ReaderReadHistory & Document;
