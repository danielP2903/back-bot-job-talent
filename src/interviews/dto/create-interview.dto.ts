import { IUserDecode } from '@/shared/models/user-decode';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
export enum Assistant {
  questions = 'GeneratorQuestionsInterview',
  analyze = 'AnalyzeResponsesQuestions',
}
export class GenerateResponseAssistantDto {
  @IsString()
  readonly response: string;
  @IsString()
  readonly threadId: string;
  @IsEnum([Assistant.questions, Assistant.analyze])
  readonly assistant: Assistant;
  @IsOptional()
  user: IUserDecode;
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => InterviewDto)
  interview: InterviewDto[];
  @IsString()
  @IsOptional()
  codeInterview: string;
  @IsOptional()
  @IsEmail()
  email: string;
  @IsOptional()
  @IsString()
  names: string;
}

export class InterviewDto {
  @IsString()
  question: string;
  @IsString()
  response: string;
}
