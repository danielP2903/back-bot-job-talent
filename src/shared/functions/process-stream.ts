import { QuestionData } from '../models/response-stream';

export const processStreamResponse = (buffer: string): QuestionData => {
  const jsonData: { [key: string]: any } = {};

  const lines = buffer.split('\n').filter((line) => line.trim() !== '');
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
  return jsonData;
};
