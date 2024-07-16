import { IUserDecode } from '@/shared/models/user-decode';
import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsMongoId()
  @IsOptional()
  idUserRecruitment: string;
  @IsArray()
  questions: string[];
  @IsOptional()
  user: IUserDecode;
  @IsString()
  titleVacancy: string;
  @IsString()
  description: string;
  @IsString()
  requirements: string;
}
