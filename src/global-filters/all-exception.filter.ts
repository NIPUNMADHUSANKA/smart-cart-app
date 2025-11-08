import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionFilter.name);

    constructor(private httpAdapterHost: HttpAdapterHost) { }

    catch(exception: any, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const status = HttpStatus.INTERNAL_SERVER_ERROR;

        this.logger.error(`Exception: ${exception.message}`);

        const body = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            message: exception.message,
        };

        httpAdapter.reply(ctx.getResponse(), body, status);


    }
}