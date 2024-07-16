import { Db, ObjectId } from 'mongodb';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { Inject } from '@nestjs/common';

export class QuestionRepository {
  private connection: Db;
  constructor(@Inject('DATABASE_CONNECTION') public db: Db) {
    this.connection = db;
  }
  async saveQuestion(body: CreateQuestionDto) {
    const { questions, user, description, requirements, titleVacancy } = body;
    console.log(user);

    const idRecruitment = new ObjectId(user.idRecruitment);
    const document = {
      user: { idRecruitment, email: user.email },
      questions,
      description,
      requirements,
      titleVacancy,
    };
    return await this.connection
      .collection('interviews')
      .insertOne(document)
      .then();
  }
}
