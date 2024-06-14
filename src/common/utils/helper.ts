import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import axios, { AxiosError } from 'axios';

export const removeUndefinedValues = (
  obj: Record<string, any>,
): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }

  return result;
};

export type IError = {
  message: string;
  cause?: string;
  code: number;
};

type HandleErrorOptions = {
  isThrowError?: boolean;
  context?: string;
};

export const handleError = (
  error: unknown,
  options?: HandleErrorOptions,
): IError => {
  const logger = new Logger(
    options?.context ? options?.context : 'HandleError',
  );
  const response: IError = {
    message: 'Something went wrong',
    code: 400,
  };
  if (
    error instanceof PrismaClientKnownRequestError ||
    error instanceof PrismaClientUnknownRequestError
  ) {
    console.error('Prisma Error:', error.message);
    response.message = `Internal error`;
    response.cause = `Cannot reach database.`;
  } else if (axios.isAxiosError(error)) {
    const axiosError: AxiosError = error;
    const errorObject = (axiosError?.response?.data ?? {}) as any;
    logger.fatal(`Axios Error : ${axiosError.code}`);
    logger.error(errorObject);
    const geckoError = (errorObject as any)?.status?.error_message;
    if (typeof geckoError == 'string') {
      response.cause = geckoError;
    } else {
      response.message =
        typeof errorObject == 'string'
          ? errorObject
          : typeof axiosError.message == 'string'
          ? String(axiosError.message)
          : typeof (axiosError.status as any)?.error_message == 'string'
          ? (axiosError.status as any)?.error_message
          : 'unknown';
    }
    response.code = axiosError.response?.status || 400;

    if (typeof errorObject == 'object' && 'detail' in errorObject) {
      if (typeof errorObject.detail == 'string') {
        const detail = String(errorObject.detail);
        response.message = detail;
      } else if (
        Array.isArray(errorObject.detail) &&
        (errorObject.detail ?? []).length >= 1
      ) {
        response.message = errorObject.detail[0].msg;
      }
    } else if (typeof errorObject == 'object' && 'message' in errorObject) {
      if (typeof errorObject.message == 'string') {
        // response.cause = String(errorObject.message);
        response.message = String(errorObject.message);
      }
    }
  } else if (error instanceof Error) {
    logger.fatal(`Error : ${error.name}`);
    logger.error(error.message);
    response.message = error.message;
  } else {
    logger.fatal(`Unknown Error : `);
    logger.error(error);
  }
  logger.fatal('---------------------------------');
  if (options?.isThrowError) {
    throw new HttpException(response.message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
  return response;
};
