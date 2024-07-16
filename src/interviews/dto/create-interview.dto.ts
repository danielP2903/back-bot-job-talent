import { IsEnum, IsString } from 'class-validator';
export enum Assistant {
  questions = 'GeneratorQuestionsInterview',
  analyze = 'AnalyzeResponsesQuestions',
}
export class CreateInterviewDto {
  @IsString()
  readonly response: string;
  @IsString()
  readonly threadId: string;
  @IsEnum([Assistant.questions, Assistant.analyze])
  readonly assistant: Assistant;
}
