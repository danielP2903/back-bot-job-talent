import { IsArray, IsEnum, IsString } from 'class-validator';
import { Assistant } from './create-interview.dto';

export class QualifierInterview {
  @IsArray()
  readonly interview: InterviewDto[];
  @IsString()
  readonly threadId: string;
  @IsEnum([Assistant.questions, Assistant.analyze])
  readonly assistant: Assistant;
}

export class InterviewDto {
  question: string;
  response: string;
}
