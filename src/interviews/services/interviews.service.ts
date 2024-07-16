import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { configApp } from '@/config/configuration';
import { CreateInterviewDto } from '../dto/create-interview.dto';
import { AssistantResponse, generateId } from 'ai';
import { Parameters } from '@/shared/functions/common-functions';

@Injectable()
export class InterviewsService {
  private openai = new OpenAI({
    apiKey: configApp().api_key_ia,
  });
  async createTrhead() {
    const { id } = await this.openai.beta.threads.create();
    return id;
  }
  async runChat(interview: CreateInterviewDto) {
    const { threadId, response } = interview;
    const runQueue = [];

    await this.openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: response,
    });
    const run = await this.openai.beta.threads.runs.create(threadId, {
      assistant_id: process.env.TUTOR_ASS,
    });
    runQueue.push({ id: generateId(), run });
    const runStatus = await this.openai.beta.threads.runs.retrieve(
      threadId,
      run.id,
    );

    if (runStatus.status === 'completed') {
      return runStatus;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const messageList = await this.openai.beta.threads.messages.list(threadId);
    const messages = messageList.data.map((msg) => ({
      role: msg.role,
      content: msg.content.map((content) => (content as any).text.value),
    }));
    return messages.reverse();
  }

  async Post(interview: CreateInterviewDto) {
    const { threadId, response } = interview;

    const createdMessage = await this.openai.beta.threads.messages.create(
      threadId,
      {
        role: 'user',
        content: response,
      },
    );
    return AssistantResponse(
      { threadId, messageId: createdMessage.id },
      async ({ forwardStream }) => {
        const runStream = this.openai.beta.threads.runs.stream(threadId, {
          assistant_id:
            process.env.ASSISTANT_INTERVIEW ??
            (() => {
              throw new Error('ASSISTANT_ID is not set');
            })(),
        });

        // forward run status would stream message deltas
        let runResult = await forwardStream(runStream);

        while (
          runResult?.status === 'requires_action' &&
          runResult.required_action?.type === 'submit_tool_outputs'
        ) {
          const tool_outputs =
            runResult.required_action.submit_tool_outputs.tool_calls.map(
              (toolCall: any) => {
                const parameters = JSON.parse(toolCall.function.arguments);
                console.log(toolCall.function.name);
                return parameters;
              },
            );

          runResult = await forwardStream(
            this.openai.beta.threads.runs.stream(
              threadId,

              {
                ...tool_outputs,
                assistant_id: process.env.ASSISTANT_INTERVIEW,
              },
            ),
          );
        }
      },
    );
  }
  async POST(interview: CreateInterviewDto) {
    // Parse the request body
    const { threadId, response } = interview;

    // Create a thread if needed

    // Add a message to the thread
    const createdMessage = await this.openai.beta.threads.messages.create(
      threadId,
      {
        role: 'user',
        content: response,
      },
    );

    return AssistantResponse(
      { threadId, messageId: createdMessage.id },
      async ({ forwardStream }) => {
        const runStream = this.openai.beta.threads.runs.stream(threadId, {
          assistant_id:
            process.env.TUTOR_ASS ??
            (() => {
              throw new Error('ASSISTANT_ID is not set');
            })(),
        });

        // forward run status would stream message deltas
        let runResult = await forwardStream(runStream);

        while (
          runResult?.status === 'requires_action' &&
          runResult.required_action?.type === 'submit_tool_outputs'
        ) {
          const tool_outputs =
            runResult.required_action.submit_tool_outputs.tool_calls.map(
              (toolCall: any) => {
                const parameters = JSON.parse(toolCall.function.arguments);
                console.log(toolCall.function.name);
                return parameters;
              },
            );

          runResult = await forwardStream(
            this.openai.beta.threads.runs.stream(
              threadId,

              {
                ...tool_outputs,
                assistant_id: process.env.TUTOR_ASS,
              },
            ),
          );
        }
      },
    );
  }

  async generateResponseAssistant(interview: CreateInterviewDto) {
    const { threadId, response, assistant } = interview;

    const methodGetAssistant = Parameters.getAssistant(assistant);
    const assistantId = methodGetAssistant();
    const createdMessage = await this.openai.beta.threads.messages.create(
      threadId,
      {
        role: 'user',
        content: response,
      },
    );
    return AssistantResponse(
      { threadId, messageId: createdMessage.id },
      async ({ forwardStream }) => {
        const runStream = this.openai.beta.threads.runs.stream(threadId, {
          assistant_id: assistantId,
        });

        let runResult = await forwardStream(runStream);

        while (
          runResult?.status === 'requires_action' &&
          runResult.required_action?.type === 'submit_tool_outputs'
        ) {
          const tool_outputs =
            runResult.required_action.submit_tool_outputs.tool_calls.map(
              (toolCall: any) => {
                const parameters = JSON.parse(toolCall.function.arguments);
                return parameters;
              },
            );

          runResult = await forwardStream(
            this.openai.beta.threads.runs.stream(
              threadId,

              {
                ...tool_outputs,
                assistant_id: assistantId,
              },
            ),
          );
        }
      },
    );
  }
}
