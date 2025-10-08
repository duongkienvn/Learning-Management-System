import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import process from 'node:process';
import { updateGlobalConfig } from 'nestjs-paginate';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  updateGlobalConfig({
    defaultOrigin: undefined,
    defaultLimit: 10,
    defaultMaxLimit: 100,
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
