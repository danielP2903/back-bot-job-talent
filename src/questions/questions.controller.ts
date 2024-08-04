import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { AuthGuard } from '@/shared/guards/auth/auth.guard';
import { Request, Response } from 'express';
import { Parameters } from '@/shared/functions/common-functions';
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  @Get()
  getInterviews(
    @Query('skip') skip: string,
    @Query('limit') limit: string,
    @Req() request: Request,
  ) {
    const email = request['user'].email;
    return this.questionsService.getInterviews(email, +skip, +limit);
  }

  @UseGuards(AuthGuard)
  @Get('code')
  getCodeInterview(@Query('interview') idInterview: string) {
    return this.questionsService.generateCode(idInterview);
  }
  @Get('validateCode')
  validateCode(@Query('codeInterview') code: string) {
    return this.questionsService.validateCode(code);
  }

  @UseGuards(AuthGuard)
  @Get('resultInterviews')
  getResultInterviews(
    @Query('identifier') identifier: string,
    @Query('skip') skip: string,
    @Query('limit') limit: string,
  ) {
    return this.questionsService.getResultsInterviews(
      identifier,
      +skip,
      +limit,
    );
  }
  // @UseGuards(AuthGuard)
  @Get('reportInterview')
  async getReportResult(
    @Query('identifier') identifier: string,
    @Res() response: Response,
  ) {
    const pdfDoc =
      await this.questionsService.getResultsInterviewPdf(identifier);
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Reporte-Entrevista';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
