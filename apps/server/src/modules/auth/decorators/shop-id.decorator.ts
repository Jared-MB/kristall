import {
	createParamDecorator,
	ExecutionContext,
	ForbiddenException,
} from "@nestjs/common";
import type { AuthRequest } from "../../../common/types/request";

/**
 * Tienda del usuario autenticado, ya validada contra la URL por `ShopScopeGuard`.
 * Es la única fuente fiable de `shopId` para las consultas.
 */
export const ShopId = createParamDecorator(
	(_data: unknown, context: ExecutionContext): string => {
		const request = context.switchToHttp().getRequest<AuthRequest>();
		const shopId = request.user?.shopId;

		if (!shopId) {
			throw new ForbiddenException("El usuario no pertenece a ninguna tienda");
		}

		return shopId;
	},
);
