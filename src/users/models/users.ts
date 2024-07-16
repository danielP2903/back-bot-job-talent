export interface IUsersResponse {
  _id: string;
  names: string;
  lastnames: string;
  company: string;
  email: string;
  password: string;
  status: Status;
}

export enum Status {
  'ACTIVE' = 1,
  'INACTIVE' = 2,
}
