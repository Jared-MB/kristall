import type { ApiErrorResponse, ApiFieldError } from "@kristall/shared";
import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from "@nestjs/common";
import type { Response } from "express";

interface ErrorInfo {
	statusCode: number;
	message: string;
	error: Record<string, unknown> | string;
	fields?: ApiFieldError[];
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(HttpExceptionFilter.name);

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		const { statusCode, message, error, fields } =
			this.extractErrorInfo(exception);

		const body: ApiErrorResponse = {
			status: "error",
			statusCode,
			message,
			error,
			...(fields && fields.length > 0 ? { fields } : {}),
		};

		response.status(statusCode).json(body);
	}

	private extractErrorInfo(exception: unknown): ErrorInfo {
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
			const rawMessage = responseBody.message ?? exception.message;
			const fields = this.extractFieldErrors(responseBody.fields ?? rawMessage);

			return {
				statusCode,
				message: this.stringifyMessage(rawMessage, fields),
				error: (responseBody.error as string) ?? this.reasonPhrase(statusCode),
				fields,
			};
		}

		this.logger.error("Unhandled exception", exception);

		return {
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: "Internal server error",
			error: "Internal Server Error",
		};
	}

	/**
	 * Turns the `HttpStatus` key into its reason phrase, so an exception built
	 * from a custom body still reports `Bad Request` and not `BAD_REQUEST`.
	 */
	private reasonPhrase(statusCode: number): string {
		const key = HttpStatus[statusCode];

		if (!key) {
			return "Error";
		}

		return key
			.toLowerCase()
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	}

	/**
	 * Normalizes the field-level errors carried by an exception. Objects are
	 * accepted under a couple of key spellings so both our own validations and
	 * third-party ones survive the envelope instead of collapsing into
	 * `[object Object]`.
	 */
	private extractFieldErrors(candidate: unknown): ApiFieldError[] | undefined {
		if (!Array.isArray(candidate)) {
			return undefined;
		}

		const fields = candidate.flatMap((item): ApiFieldError[] => {
			if (typeof item !== "object" || item === null) {
				return [];
			}

			const entry = item as Record<string, unknown>;
			const field = entry.field ?? entry.name ?? entry.property;
			const message = entry.message ?? entry.error;

			if (typeof field !== "string" || typeof message !== "string") {
				return [];
			}

			return [{ field, message }];
		});

		return fields.length > 0 ? fields : undefined;
	}

	private stringifyMessage(
		rawMessage: unknown,
		fields: ApiFieldError[] | undefined,
	): string {
		if (fields) {
			return fields
				.map(({ field, message }) => `${field}: ${message}`)
				.join(", ");
		}

		if (Array.isArray(rawMessage)) {
			return rawMessage
				.map((item) => (typeof item === "string" ? item : JSON.stringify(item)))
				.join(", ");
		}

		return typeof rawMessage === "string"
			? rawMessage
			: JSON.stringify(rawMessage);
	}
}
