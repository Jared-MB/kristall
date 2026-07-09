import type { ApiSuccessResponse } from "@kristall/shared";
import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import type { Response } from "express";
import { map, Observable } from "rxjs";

@Injectable()
export class TransformInterceptor<T>
	implements NestInterceptor<T, ApiSuccessResponse<T>>
{
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<ApiSuccessResponse<T>> {
		const response = context.switchToHttp().getResponse<Response>();

		return next.handle().pipe(
			map((data) => ({
				status: "ok" as const,
				statusCode: response.statusCode,
				message: "OK",
				data: data as T,
			})),
		);
	}
}
