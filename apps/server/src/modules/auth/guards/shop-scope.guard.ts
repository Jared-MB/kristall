import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { AuthRequest } from "../../../common/types/request";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

/** Parámetro de ruta que identifica la tienda: `/:shop/...`. */
export const SHOP_PARAM = "shop";

/**
 * El `[shop]` de la URL lo controla el cliente, así que no se puede usar tal cual
 * para consultar. Este guard lo contrasta contra la tienda del token; a partir de
 * ahí los servicios filtran siempre por `req.user.shopId` (ver `@ShopId()`).
 */
@Injectable()
export class ShopScopeGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			return true;
		}

		const request = context.switchToHttp().getRequest<AuthRequest>();
		const requestedShopId = request.params?.[SHOP_PARAM];

		// La ruta no está scopeada por tienda: no hay nada que contrastar.
		if (!requestedShopId) {
			return true;
		}

		if (!request.user?.shopId) {
			throw new ForbiddenException("El usuario no pertenece a ninguna tienda");
		}

		if (request.user.shopId !== requestedShopId) {
			throw new ForbiddenException("El usuario no pertenece a esta tienda");
		}

		return true;
	}
}
