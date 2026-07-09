import type { ApiErrorResponse } from "@kristall/shared";
import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from "@nestjs/common";
import type { Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(HttpExceptionFilter.name);

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		const { statusCode, message, error } = this.extractErrorInfo(exception);

		const body: ApiErrorResponse = {
			status: "error",
			statusCode,
			message,
			error,
		};

		response.status(statusCode).json(body);
	}

	private extractErrorInfo(exception: unknown): {
		statusCode: number;
		message: string;
		error: Record<string, unknown> | string;
	} {
		if (exception instanceof HttpException) {
			const statusCode = exception.getStatus();
			const exceptionResponse = exception.getResponse();

			if (typeof exceptionResponse === "string") {
				return {
					statusCode,
					message: exceptionResponse,
					error: exceptionResponse,
				};
			}

			const responseBody = exceptionResponse as Record<string, unknown>;
			const message = (responseBody.message as string) ?? exception.message;

			return {
				statusCode,
				message: Array.isArray(message) ? message.join(", ") : message,
				error:
					(responseBody.error as string) ?? HttpStatus[statusCode] ?? "Error",
			};
		}

		this.logger.error("Unhandled exception", exception);

		return {
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: "Internal server error",
			error: "Internal Server Error",
		};
	}
}
