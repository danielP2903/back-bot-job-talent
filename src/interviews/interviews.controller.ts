import { Controller, Get, Post, Body, Res, UseGuards } from '@nestjs/common';
import { InterviewsService } from './services/interviews.service';
import { GenerateResponseAssistantDto } from './dto/create-interview.dto';
import { Response } from 'express';
import { ProcessStreamService } from './services/process-stream/process-stream.service';
import { AuthGuard } from '@/shared/guards/auth/auth.guard';

@Controller('interviews')
export class InterviewsController {
  constructor(
    private readonly interviewsService: InterviewsService,
    private readonly streamService: ProcessStreamService,
  ) {}

  @Post()
  async runChat(@Body() payload: GenerateResponseAssistantDto) {
    return await this.interviewsService.runChat(payload);
  }

  @Get()
  createThread() {
    return this.interviewsService.createTrhead();
  }

  @Post('math')
  async runChatMath(
    @Body() payload: GenerateResponseAssistantDto,
    @Res() res: Response,
  ) {
    const stream = await this.interviewsService.Post(payload);
    const jsonData: { [key: string]: any } = {};
    const st = await stream.text();
    const lines = st.split('\n').filter((line) => line.trim() !== '');

    lines.forEach((line) => {
      const [key, ...rest] = line.split(':');
      const value = rest.join(':').trim();

      if (jsonData[key]) {
        if (Array.isArray(jsonData[key])) {
          jsonData[key].push(value);
        } else {
          jsonData[key] = [jsonData[key], value];
        }
      } else {
        try {
          jsonData[key] = JSON.parse(value);
        } catch {
          jsonData[key] = value;
        }
      }
    });

    res.json(jsonData);
  }

  @UseGuards(AuthGuard)
  @Post('generator-questions')
  async generateQuestionInterview(
    @Body() payload: GenerateResponseAssistantDto,
  ) {
    const stream =
      await this.interviewsService.generateResponseAssistant(payload);

    const response = await this.streamService.processResponse(stream);
    return response;
  }

  @Post('qualifier')
  async qualifierInterview(@Body() payload: GenerateResponseAssistantDto) {
    const stream =
      await this.interviewsService.generateResponseAssistant(payload);
    const result = (await this.streamService.processResponseQualifier(
      stream,
    )) as any;
    await this.interviewsService.saveInterview(
      payload.codeInterview,
      payload.interview,
      payload.email,
      result.calificacion_global as string,
      result.comentarios as string,
      result.feedback as string,
      payload.names,
    );
    return result;
  }
}
