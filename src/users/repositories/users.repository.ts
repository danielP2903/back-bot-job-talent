import { Inject } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { Db } from 'mongodb';
import { IUsersResponse, Status } from '../models/users';
export class UserRepository {
  private connection: Db;
  constructor(@Inject('DATABASE_CONNECTION') public db: Db) {
    this.connection = db;
  }

  async createUserRecruit(user: CreateUserDto) {
    const document = {
      ...user,
      status: Status.ACTIVE,
    };
    return await this.connection.collection('users').insertOne(document).then();
  }

  async getUserByEmail(email: string): Promise<IUsersResponse> {
    const query = { email };
    return await this.connection.collection('users').findOne(query).then();
  }
}
