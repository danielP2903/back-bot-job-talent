import { ObjectId } from 'mongodb';

export interface ICodeSearch {
  _id: string;
  idInterview: ObjectId;
  code: string;
  isActive: boolean;
  dateCreation: string;
}
