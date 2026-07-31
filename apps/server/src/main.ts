import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { setupSwagger } from "./swagger";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	);
	app.useGlobalInterceptors(new TransformInterceptor());
	app.useGlobalFilters(new HttpExceptionFilter());

	setupSwagger(app);

	await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
