import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './repositories/users.repository';
import { MessagesError } from '@/shared/errors/MessagesErrors';
import * as bcrypt from 'bcrypt';
import { Status } from './models/users';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UserRepository) {}
  async create(dto: CreateUserDto) {
    const user = await this.repository.getUserByEmail(dto.email);
    if (user) throw new BadRequestException(MessagesError.USER_ALREADY_EXIST);
    dto.password = bcrypt.hashSync(dto.password, 10);
    const result = await this.repository.createUserRecruit(dto);
    return result;
  }

  async getUserByEmail(email: string) {
    const user = await this.repository.getUserByEmail(email);
    if (!user || user.status === Status.INACTIVE)
      throw new NotFoundException(MessagesError.USER_NOT_FOUND);

    return user;
  }
}
