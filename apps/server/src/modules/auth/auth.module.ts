import { ONE_DAY_SESSION_EXPIRATION_TIME_IN_MS } from "@kristall/shared";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShopsModule } from "../shops/shops.module";
import { UsersModule } from "../users/users.module";
import { jwtConstants } from "./constants";
import { AuthController } from "./controllers/auth.controller";
import { Account } from "./entities/account.entity";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AccountService } from "./services/account.service";
import { AuthService } from "./services/auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
	imports: [
		ShopsModule,
		UsersModule,
		PassportModule,
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: ONE_DAY_SESSION_EXPIRATION_TIME_IN_MS },
		}),
		TypeOrmModule.forFeature([Account]),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		AccountService,
	],
})
export class AuthModule {}
