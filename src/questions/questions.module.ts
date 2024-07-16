import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { QuestionRepository } from './repositories/question.repository';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  controllers: [QuestionsController],
  imports: [DatabaseModule, AuthModule],
  providers: [QuestionsService, QuestionRepository],
})
export class QuestionsModule {}
