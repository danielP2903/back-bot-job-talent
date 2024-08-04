import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionRepository } from './repositories/question.repository';
import { MessagesError } from '@/shared/errors/MessagesErrors';
import * as crypto from 'crypto';
import { ICodeSearch } from './dto/code-seatch';
import { ReportsService } from '@/reports/reports.service';
import {
  getReportInterviewPdf,
  IResultInterview,
} from '@/shared/reports/report-interview';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly repository: QuestionRepository,
    private readonly reportService: ReportsService,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    if (createQuestionDto.questions.length !== 5) {
      throw new BadRequestException(
        MessagesError.MAXIMUM_FIVE_QUESTIONS_BY_INTERVIEW,
      );
    }
    return await this.repository.saveQuestion(createQuestionDto);
  }
  async getInterviews(user: string, skip: number, limit: number) {
    return await this.repository.getInterviews(user, skip, limit);
  }

  async generateCode(idInterview: string) {
    const digits = '0123456789';
    let code = '';
    const digitsLength = digits.length;
    for (let i = 0; i < 8; i++) {
      const randomIndex = crypto.randomInt(0, digitsLength);
      code += digits[randomIndex];
    }
    const interview = await this.repository.getOneInterview(idInterview);
    if (!interview) throw new NotFoundException('La entrevista no existe');
    await this.repository.saveCodeInterview(code, idInterview);
    return code;
  }

  async validateCode(code: string) {
    const _code = await this.repository.searchCode(code);
    if (!_code || _code?.isActive === false) {
      throw new BadRequestException('Código inválido');
    }
    const interview = await this.repository.getOneInterview(
      _code.idInterview.toString(),
    );
    if (!interview) throw new NotFoundException('La entrevista no existe');
    return interview;
  }

  async saveInterview(
    id: string,
    interview: any,
    email: string,
    qualification: string,
    comments: string,
    feedback: string,
    user: { idRecruitment: string; email: string },
    names: string,
  ) {
    const result = await this.repository.saveInterview(
      id,
      interview,
      email,
      qualification,
      comments,
      feedback,
      user,
      names,
    );
    return result;
  }

  async getCode(code: string) {
    const _code = await this.repository.searchCode(code);
    if (!_code || _code?.isActive === false) {
      throw new BadRequestException('Código inválido');
    }
    return _code;
  }

  async updateCode(code: ICodeSearch) {
    const result = await this.repository.updateCode(code);
    console.log(result, 'RESULTADO ACTUALIZACION CODIGO');

    return result;
  }

  async getResultsInterviews(identifier: string, skip: number, limit: number) {
    return await this.repository.getResultsInterviews(identifier, skip, limit);
  }

  async getResultsInterviewPdf(identifier: string) {
    const resultInterview =
      await this.repository.getOneResultInterview(identifier);
    const interview = await this.repository.getOneInterview(
      resultInterview.idInterview as any,
    );
    if (!resultInterview || !interview)
      throw new NotFoundException('No se encontrarón resultados');
    const data = {
      ...resultInterview,
      vacancy: interview.titleVacancy as any,
    };
    const definition = getReportInterviewPdf(data as IResultInterview);
    return this.reportService.createPDF(definition);
  }
}
