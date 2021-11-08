import {
  ExceptionFilter,
  Catch,
  HttpStatus,
  HttpException,
  ArgumentsHost,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    //If HttpException return predefined status, otherwise return internal server error
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    //return error message
    const errMessage = exception.message || null;
    //define the log message in response
    const msgLog = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errMessage,
    };
    //output exception log with Winston logger system
    this.logger.error(msgLog);
    //Return error information in http response body
    response.status(status).json(msgLog);
  }
}
