import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MessagesError } from '@/shared/errors/MessagesErrors';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;
    const user = await this.userService.getUserByEmail(email);
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException(MessagesError.INVALID_CREDENTIALS);
    }
    const payload = {
      sub: user._id,
      email: user.email,
    };
    return {
      access_token: await this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '23h',
      }),
    };
  }
}
