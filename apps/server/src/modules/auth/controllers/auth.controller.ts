import {
	Body,
	Controller,
	Get,
	Post,
	Request,
	UseGuards,
} from "@nestjs/common";
import type { AuthRequest } from "../../../common/types/request";
import { User } from "../../users/entities/user.entity";
import { UsersService } from "../../users/services/users.service";
import { Public } from "../decorators/public.decorator";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { AuthService } from "../services/auth.service";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UsersService,
	) {}

	@Public()
	@UseGuards(LocalAuthGuard)
	@Post("login")
	async login(@Request() req: { user: User }) {
		return this.authService.login(req.user);
	}

	@Public()
	@Post("register")
	async register(
		@Body() body: Parameters<typeof this.authService.register>[0],
	) {
		return this.authService.register(body);
	}

	@Get("profile")
	getProfile(@Request() req: AuthRequest) {
		return this.userService.findOneById(req.user.userId);
	}

	@Get("verify-token")
	verifyToken(@Request() req: AuthRequest) {
		return req.user;
	}
}
