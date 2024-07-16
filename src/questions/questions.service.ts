import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionRepository } from './repositories/question.repository';
import { MessagesError } from '@/shared/errors/MessagesErrors';

@Injectable()
export class QuestionsService {
  constructor(private readonly repository: QuestionRepository) {}

  async create(createQuestionDto: CreateQuestionDto) {
    if (createQuestionDto.questions.length !== 5) {
      throw new BadRequestException(
        MessagesError.MAXIMUM_FIVE_QUESTIONS_BY_INTERVIEW,
      );
    }
    return await this.repository.saveQuestion(createQuestionDto);
  }
}
