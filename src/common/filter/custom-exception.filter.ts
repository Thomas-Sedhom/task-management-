import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = 500;
    let message = 'Internal server error';
    let errorResponse: any;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).message
          : exceptionResponse;

      errorResponse = {
        statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      };
    } else if (exception.code === 11000) {
      // MongoDB duplicate key error
      statusCode = 400;
      const key = Object.keys(exception.keyValue)[0];
      message = `${key} "${exception.keyValue[key]}" already exists`;

      errorResponse = {
        statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
        error: 'Duplicate Key Error',
        keyValue: exception.keyValue,
      };
    } else {
      // fallback for unknown errors
      errorResponse = {
        statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      };
    }

    response.status(statusCode).json(errorResponse);
  }
}
