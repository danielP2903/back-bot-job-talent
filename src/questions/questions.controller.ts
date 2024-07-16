import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { AuthGuard } from '@/shared/guards/auth/auth.guard';
import { Request } from 'express';
import { Parameters } from '@/shared/functions/common-functions';
@UseGuards(AuthGuard)
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  saveQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
    @Req() request: Request,
  ) {
    const body = Parameters.setUserRequest<CreateQuestionDto>(
      createQuestionDto,
      request,
    );
    return this.questionsService.create(body);
  }
}
