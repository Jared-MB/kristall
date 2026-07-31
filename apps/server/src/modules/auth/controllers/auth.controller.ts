import {
	Body,
	Controller,
	Get,
	Post,
	Request,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
	ApiErrorWrapped,
	ApiOkWrapped,
} from "../../../common/decorators/api-response.decorator";
import type { AuthRequest } from "../../../common/types/request";
import { UserDto } from "../../users/dtos/user.dto";
import { User } from "../../users/entities/user.entity";
import { UsersService } from "../../users/services/users.service";
import { Public } from "../decorators/public.decorator";
import { LoginDto, LoginResponseDto } from "../dtos/login.dto";
import { RegisterDto, RegisterResponseDto } from "../dtos/register.dto";
import { TokenPayloadDto } from "../dtos/token-payload.dto";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { AuthService } from "../services/auth.service";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UsersService,
	) {}

	@Public()
	@UseGuards(LocalAuthGuard)
	@Post("login")
	@ApiOperation({ summary: "Exchange email and password for a JWT" })
	@ApiBody({ type: LoginDto })
	@ApiOkWrapped(LoginResponseDto, { status: 201 })
	@ApiErrorWrapped(401, "Unknown email or wrong password")
	async login(@Request() req: { user: User }) {
		return this.authService.login(req.user);
	}

	@Public()
	@Post("register")
	@ApiOperation({
		summary: "Create a shop with its first user and account",
		description:
			"Runs in a single transaction: the shop, the user and the account are created together or not at all.",
	})
	@ApiBody({ type: RegisterDto })
	@ApiOkWrapped(RegisterResponseDto, { status: 201 })
	@ApiErrorWrapped(400, "Invalid payload")
	async register(
		@Body() body: Parameters<typeof this.authService.register>[0],
	) {
		return this.authService.register(body);
	}

	@Get("profile")
	@ApiBearerAuth("bearer")
	@ApiOperation({ summary: "Profile of the authenticated user" })
	@ApiOkWrapped(UserDto, {
		nullable: true,
		description: "`data` is `null` when the user no longer exists",
	})
	@ApiErrorWrapped(401, "Missing or invalid token")
	getProfile(@Request() req: AuthRequest) {
		return this.userService.findOneById(req.user.userId);
	}

	@Get("verify-token")
	@ApiBearerAuth("bearer")
	@ApiOperation({
		summary: "Validate the bearer token and echo back its payload",
	})
	@ApiOkWrapped(TokenPayloadDto)
	@ApiErrorWrapped(401, "Missing or invalid token")
	verifyToken(@Request() req: AuthRequest) {
		return req.user;
	}
}
