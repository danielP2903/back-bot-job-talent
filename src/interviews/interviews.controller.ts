import { Controller, Get, Post, Body, Res, UseGuards } from '@nestjs/common';
import { InterviewsService } from './services/interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { Response } from 'express';
import { ProcessStreamService } from './services/process-stream/process-stream.service';
import { AuthGuard } from '@/shared/guards/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('interviews')
export class InterviewsController {
  constructor(
    private readonly interviewsService: InterviewsService,
    private readonly streamService: ProcessStreamService,
  ) {}

  @Post()
  async runChat(@Body() payload: CreateInterviewDto) {
    return await this.interviewsService.runChat(payload);
  }

  @Get()
  createThread() {
    return this.interviewsService.createTrhead();
  }

  @Post('math')
  async runChatMath(@Body() payload: CreateInterviewDto, @Res() res: Response) {
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

  @Post('generator-questions')
  async generateQuestionInterview(@Body() payload: CreateInterviewDto) {
    const stream =
      await this.interviewsService.generateResponseAssistant(payload);

    const response = await this.streamService.processResponse(stream);
    return response;
  }
}
