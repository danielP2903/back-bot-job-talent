import { Db, ObjectId } from 'mongodb';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { Inject } from '@nestjs/common';
import { ICodeSearch } from '../dto/code-seatch';

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
      dateCreation: new Date().toISOString(),
    };
    return await this.connection
      .collection('interviews')
      .insertOne(document)
      .then();
  }
  async getInterviews(user: string, skip: number, limit: number) {
    const query = {
      'user.email': user,
    };
    return await this.connection
      .collection('interviews')
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();
  }
  async getResultsInterviews(idInterview: string, skip: number, limit: number) {
    const mongoId = new ObjectId(idInterview);
    const query = {
      idInterview: mongoId,
    };
    return await this.connection
      .collection('result_interviews')
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();
  }
  async getOneResultInterview(idInterview: string) {
    const mongoId = new ObjectId(idInterview);
    const query = {
      idInterview: mongoId,
    };
    return await this.connection
      .collection('result_interviews')
      .findOne(query)
      .then();
  }
  async getOneInterview(idInterview: string) {
    const objectId = new ObjectId(idInterview);

    return await this.connection
      .collection('interviews')
      .findOne({ _id: objectId })
      .then();
  }

  async saveCodeInterview(code: string, idInterview: string) {
    const objectId = new ObjectId(idInterview);
    const document = {
      idInterview: objectId,
      code,
      isActive: true,
      dateCreation: new Date().toISOString(),
    };
    return await this.connection
      .collection('code_interviews')
      .insertOne(document)
      .then();
  }

  async saveInterview(
    idInterview: string,
    interview: any,
    email: string,
    qualification: string,
    comments: string,
    feedback: string,
    user: { idRecruitment: string; email: string },
    names: string,
  ) {
    const id = new ObjectId(idInterview);
    const document = {
      idInterview: id,
      interview,
      presenter: { email, names },
      qualification,
      comments,
      feedback,
      user,
    };
    return await this.connection
      .collection('result_interviews')
      .insertOne(document)
      .then();
  }

  async searchCode(code: string): Promise<ICodeSearch> {
    return await this.connection
      .collection('code_interviews')
      .findOne({ code: code })
      .then();
  }

  async updateCode(code: ICodeSearch) {
    const id = new ObjectId(code._id);

    return await this.connection
      .collection('code_interviews')
      .updateOne({ _id: id }, { $set: { ...code, isActive: false } })
      .then();
  }
}
