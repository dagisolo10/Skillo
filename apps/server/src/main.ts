import { AppModule } from "@/app.module.js";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        credentials: true,
        origin: ["http://localhost:3001"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
