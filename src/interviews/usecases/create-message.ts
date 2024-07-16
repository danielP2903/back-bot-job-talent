import OpenAI from 'openai';

interface Options {
  threadId: string;
  message: string;
}
export const createMessageUseCase = async (
  openAi: OpenAI,
  options: Options,
) => {
  const { threadId, message } = options;
  const response = await openAi.beta.threads.messages.create(threadId, {
    role: 'user',
    content: message,
  });
  return response;
};
