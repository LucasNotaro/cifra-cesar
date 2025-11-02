import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BadRequestException)
export class FormValidationFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const contentType = request.headers['content-type'] ?? '';
    const acceptsJson =
      typeof request.accepts === 'function' &&
      request.accepts(['html', 'json']) === 'json';
    const expectsJson =
      contentType.includes('application/json') ||
      acceptsJson ||
      request.xhr === true;

    const payload = exception.getResponse() as
      | { message?: string | string[] }
      | undefined;
    const mensagens = Array.isArray(payload?.message)
      ? payload?.message
      : payload?.message
        ? [payload.message]
        : ['Solicitacao invalida.'];
    const mensagem = mensagens[0];

    if (expectsJson) {
      response.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        error: exception.message,
        message: mensagens,
      });
      return;
    }

    const baseUrl = request.originalUrl.split('?')[0];
    const redirectUrl = `${baseUrl}?erro=${encodeURIComponent(mensagem)}`;

    response.redirect(redirectUrl);
  }
}

