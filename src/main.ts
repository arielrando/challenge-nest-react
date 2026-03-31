import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const allowedOriginsRaw =
    configService.get<string>('FRONTEND_ALLOWED_ORIGINS') ||
    'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000';
  const allowedOrigins = allowedOriginsRaw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
    console.log(allowedOrigins);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });
  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
