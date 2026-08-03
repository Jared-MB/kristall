import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../../users/services/users.service";
import { jwtConstants } from "../constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly usersService: UsersService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConstants.secret,
		});
	}

	async validate(payload: any) {
		return {
			userId: payload.sub,
			name: payload.name,
			shopId: await this.resolveShopId(payload),
		};
	}

	/**
	 * Los tokens emitidos antes de que el payload incluyera `shopId` siguen vivos
	 * hasta que caduque la cookie de sesión, así que se resuelve contra la base en
	 * lugar de invalidarlos. Solo cuesta una consulta a los tokens antiguos.
	 */
	private async resolveShopId(payload: any): Promise<string | null> {
		if (payload.shopId) {
			return payload.shopId;
		}

		const user = await this.usersService.findOneById(payload.sub);

		return user?.shopId ?? null;
	}
}
