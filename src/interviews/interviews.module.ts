import { Module } from '@nestjs/common';
import { InterviewsService } from './services/interviews.service';
import { InterviewsController } from './interviews.controller';
import { ProcessStreamService } from './services/process-stream/process-stream.service';
import { AuthModule } from '@/auth/auth.module';
import { QuestionsModule } from '@/questions/questions.module';

@Module({
  controllers: [InterviewsController],
  providers: [InterviewsService, ProcessStreamService],
  imports: [AuthModule, QuestionsModule],
})
export class InterviewsModule {}
