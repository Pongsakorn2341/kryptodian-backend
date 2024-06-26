import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { handleError } from '../utils/helper';
import { removeUndefinedValues } from './../utils/helper';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    this.logger.debug(`----------------------------------`);

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const rest = {
      cause: null,
      message: (exception as { name: string })?.name || 'Unknwon Error',
    };

    let httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (httpStatus == HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception);
    }

    if (exception instanceof UnauthorizedException) {
      httpStatus = HttpStatus.UNAUTHORIZED;
      const response = exception.getResponse() as any;
      if (typeof response === 'object') {
        rest.cause = exception.name;
        rest.message = response.message;
      } else {
        rest.message = response;
      }
    } else if (exception instanceof HttpException) {
      const request = ctx.getRequest<Request>();
      const response = exception.getResponse() as {
        message: string;
        error: string;
        statusCode: number;
      };
      if (response.statusCode !== 404) {
        this.logger.error(
          `${request.method}: ${request.url} - ${response.statusCode}`,
          null,
          'AllExceptionsFilter',
        );
        this.logger.error(
          exception.message,
          exception.stack,
          'AllExceptionsFilter',
        );
      }
      const exceptionResponse = exception.getResponse();
      console.log(
        '🚀 ~ AllExceptionsFilter ~ exceptionResponse:',
        exceptionResponse,
      );
      this.logger.debug(`${request.method}: ${request.url}`);
    } else {
      const result = handleError(exception);
      rest.cause =
        typeof result.cause == 'string' ? result.cause : result.message;
      rest.message = result.message ? result.message : (exception as string);
      httpStatus = result.code;
    }
    if (httpStatus != 404) {
      this.logger.debug(exception);
      this.logger.debug(`Cause : ${rest.cause}`);
      this.logger.debug(`[${httpStatus}] Message : ${rest.cause}`);
    }

    if (typeof rest.cause == 'string' && rest.cause.includes('this.prisma.')) {
      rest.cause = 'Prisma Error';
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      ...removeUndefinedValues(rest),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
