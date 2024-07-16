import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { MessagesError } from '../errors/MessagesErrors';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const resp = exception.getResponse();
      const message = this.validateTypeMessage(status, exception);
      const body = {
        messageException: message,
        message: resp,
        path: request.url,
        statusCode: status,
        timestamp: new Date().toISOString(),
      };
      return response.status(status).json(body);
    } else {
      this.logger.error(exception);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        ok: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: MessagesError.INTERNAL_EXCEPTION,
        messageServer:
          process.env.NODE_ENV === 'development' ? exception : null,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }

  private validateTypeMessage(status: number, exception: HttpException) {
    if (status === HttpStatus.TOO_MANY_REQUESTS) {
      return MessagesError.TOO_MANY_REQUESTS;
    } else if (status === HttpStatus.FORBIDDEN) {
      return MessagesError.FORBIDDEN_RESOURCE;
    } else {
      return exception.message;
    }
  }
}
