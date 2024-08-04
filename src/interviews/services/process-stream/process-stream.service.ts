import { processStreamResponse } from '@/shared/functions/process-stream';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProcessStreamService {
  async processResponse(stream: globalThis.Response) {
    const buffer = await stream.text();
    const responseJson = processStreamResponse(buffer);
    if (Array.isArray(responseJson['0'])) {
      responseJson['content'] = responseJson['0'].join('').replace(/"/g, '');
      delete responseJson['0'];
    }
    return responseJson;
  }

  async processResponseQualifier(stream: globalThis.Response) {
    const buffer = await stream.text();
    const responseJson = processStreamResponse(buffer);
    if (Array.isArray(responseJson['0'])) {
      responseJson['content'] = responseJson['0'].join('').replace(/"/g, '');
      delete responseJson['0'];
    }

    let content = responseJson['content'] as string;
    content = content
      .replace(/\\n/g, '\n')
      .replace(/\\,/g, ',') // Reemplazar \, por ,
      .replace(/\\(.)/g, '$1')
      .trim();

    content = content.split('\n').reduce((acc, line) => {
      const [key, ...values] = line.split(':');
      if (key && values.length) {
        acc[key.trim()] = values.join(':').trim();
      }
      return acc;
    }, {} as any);
    console.log(content);

    return content;
  }
}
