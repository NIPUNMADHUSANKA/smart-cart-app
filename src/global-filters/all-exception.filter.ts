import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionFilter.name);

    constructor(private httpAdapterHost: HttpAdapterHost) { }

    catch(exception: any, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const isHttpException = exception instanceof HttpException;
        const status = isHttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        const errorResponse = isHttpException ? exception.getResponse() : null;
        const message = isHttpException
            ? (typeof errorResponse === 'string'
                ? errorResponse
                : (errorResponse as any)?.message ?? exception.message)
            : 'Internal server error';

        this.logger.error(`Exception: ${exception.message}`);

        const body = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            message,
            errors: typeof errorResponse === 'object' ? errorResponse : undefined,
        };

        httpAdapter.reply(ctx.getResponse(), body, status);


    }
}