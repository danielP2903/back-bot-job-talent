import { configApp } from '@/config/configuration';
import { Assistant } from '@/interviews/dto/create-interview.dto';
import { Request } from 'express';

export class Parameters {
  static getAssistanGenerateQuestions(): string {
    return configApp().assistantGeneratorQuestions;
  }

  static getAssistant(assistant: Assistant) {
    const assistants = {
      GeneratorQuestionsInterview: () => this.getAssistanGenerateQuestions(),
    };
    return assistants[assistant];
  }
  static setUserRequest<T>(body: T, request: Request) {
    body['user'] = request['user'];
    return body;
  }
}
