import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionResponse } from '../interface/http-exeption-response.interface';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = 500;
    const message = 'Internal server error';
    let errorResponse: any;

    // If HttpException then handle it
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // If validation error handle it
      if (
        exception instanceof BadRequestException &&
        typeof exceptionResponse === 'object'
      ) {
        errorResponse = {
          statusCode,
          timestamp: new Date().toISOString(),
          path: request.url,
          message:
            (exceptionResponse as HttpExceptionResponse).message || message,
          error: (exceptionResponse as HttpExceptionResponse).error || message,
        };
      } else {
        // Handle other HttpExceptions
        errorResponse = {
          statusCode,
          timestamp: new Date().toISOString(),
          path: request.url,
          message:
            (typeof exceptionResponse === 'object'
              ? (exceptionResponse as HttpExceptionResponse).message
              : exceptionResponse) || exception.message,
        };
      }
    } else {
      // Handle non-HttpExceptions
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
