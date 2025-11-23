import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const errorResponse = exception.getResponse();
        const message = typeof errorResponse === 'string'
            ? errorResponse
            : (errorResponse as any)?.message ?? exception.message;

        this.logger.error(`Exception: ${exception.message}`);

        response.status(status).json({
            statusCode: status,
            timeStamp: new Date().toISOString(),
            message,
            errors: typeof errorResponse === 'object' ? errorResponse : undefined
        });
    }
}