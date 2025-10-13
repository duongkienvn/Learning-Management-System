import {
  ArgumentsHost,
  Catch,
  ExceptionFilter, ForbiddenException,
  HttpException, HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {ForbiddenError} from "@casl/ability";

@Catch()
export class AllExceptionsFilters implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message || exception.message;
    } else if (exception instanceof ForbiddenError) {
      status = HttpStatus.FORBIDDEN;
      message = 'You do not have permission.';
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || 'Internal server error!';
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Unknown error';
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    })
  }
}
