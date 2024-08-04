import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { QuestionRepository } from './repositories/question.repository';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/auth/auth.module';
import { ReportsModule } from '@/reports/reports.module';

@Module({
  controllers: [QuestionsController],
  imports: [DatabaseModule, AuthModule, ReportsModule],
  exports: [QuestionsService],
  providers: [QuestionsService, QuestionRepository],
})
export class QuestionsModule {}
