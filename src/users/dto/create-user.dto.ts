import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  names: string;
  @IsString()
  lastnames: string;
  @IsString()
  company: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
