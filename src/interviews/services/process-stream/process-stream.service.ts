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
}
