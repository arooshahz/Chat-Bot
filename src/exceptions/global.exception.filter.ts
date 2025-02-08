import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Sentry } from './sentry';
import { BaseException } from './base.exceptions';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly sentry: Sentry;

  constructor(
      private readonly httpAdapterHost: HttpAdapterHost,
  ) {
    this.sentry = new Sentry();
  }

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const req = ctx.getRequest();

    if (process.env.APP_DEBUG === 'true') {
      console.error(exception);
    }

    if (exception instanceof BaseException) {
      if (exception.shouldSendToSentry()) {
        this.sentry.captureException(exception, {
          request: {
            method: req.method || '',
            url: req.url || '',
            params: req.params || {},
            query: req.query || {},
            body: req.body || {},
          },
          response: {
            message: exception.getErrorMessage(),
            statusCode: exception.getErrorCode(),
          },
          data: exception.getErrorData(),
        });
      }

      return httpAdapter.reply(
        ctx.getResponse(),
        {
          message: exception.getErrorMessage(),
          data: exception.getErrorData(),
          debug: process.env.APP_DEBUG === 'true' ? exception.stack : false,
        },
        exception.getErrorCode(),
      );
    }

    if (
      exception instanceof PrismaClientKnownRequestError ||
      exception instanceof PrismaClientUnknownRequestError ||
      exception instanceof PrismaClientValidationError
    ) {
      this.sentry.captureException(exception, {
        request: {
          method: req.method || '',
          url: req.url || '',
          params: req.params || {},
          query: req.query || {},
          body: req.body || {},
        },
        response: {
          message: 'Forbbiden action. (please contact with support.)',
          statusCode: 403,
        },
        data: {
          cause: exception.message,
          stack: exception.stack || '',
        },
      });

      return httpAdapter.reply(
        ctx.getResponse(),
        {
          message: 'Forbbiden action. (please contact with support.)',
          data: false,
          debug:
            process.env.APP_DEBUG === 'true'
              ? {
                message: exception.message,
                stack: exception.stack,
              }
              : false,
        },
        500,
      );
    }

    if (exception instanceof HttpException) {
      return httpAdapter.reply(
        ctx.getResponse(),
        {
          message: exception.message || '',
          data: exception.getResponse(),
        },
        exception.getStatus(),
      );
    }

    this.sentry.captureException(exception, {
      request: {
        method: req.method || '',
        url: req.url || '',
        params: req.params || {},
        query: req.query || {},
        body: req.body || {},
      },
      response: {
        message: exception.message || '',
        statusCode: 500,
      },
    });

    return httpAdapter.reply(
      ctx.getResponse(),
      {
        message: exception.message || '',
        data: {},
        debug: process.env.APP_DEBUG === 'true' ? exception.stack : false,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
