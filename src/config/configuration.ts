export const configApp = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 3002,
  defaultLimit: process.env.DEFAULT_LIMIT || 5,
  api_key_ia: process.env.OPEN_AI_API_KEY,
  assistantInterview: process.env.ASSISTANT_INTERVIEW,
  assistantGeneratorQuestions: process.env.AGILE_GENERATOR_INTERVIEW,
  secret_token: process.env.SECRET_KEY,
});
