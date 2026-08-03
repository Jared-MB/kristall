import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const SWAGGER_PATH = "api";

/**
 * Mounts the OpenAPI explorer at `/api` (raw document at `/api-json`).
 */
export function setupSwagger(app: INestApplication) {
	const config = new DocumentBuilder()
		.setTitle("Kristall API")
		.setDescription(
			[
				"REST API for Kristall.",
				"",
				"Every successful response is wrapped by a common envelope",
				"(`status`, `statusCode`, `message`, `data`) and every failure by",
				"(`status`, `statusCode`, `message`, `error`).",
				"",
				"Protected endpoints expect a `Authorization: Bearer <token>` header;",
				"get a token from `POST /auth/login`.",
			].join("\n"),
		)
		.setVersion("1.0")
		.addBearerAuth(
			{
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
				description: "JWT returned by /auth/login",
			},
			"bearer",
		)
		.addTag("auth", "Login, registration and session inspection")
		.addTag("shop", "Shop the authenticated user belongs to")
		.addTag("locations", "Locations owned by the authenticated user's shop")
		.addTag("incidents", "Service health incidents")
		.addTag("health", "Liveness probe")
		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);

	SwaggerModule.setup(SWAGGER_PATH, app, documentFactory, {
		swaggerOptions: {
			persistAuthorization: true,
		},
	});
}
