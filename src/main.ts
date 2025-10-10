import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import process from 'node:process';
import { updateGlobalConfig } from 'nestjs-paginate';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

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

  const config = new DocumentBuilder()
    .setTitle('Learnning Management System')
    .setDescription('The learning-management-system API')
    .setVersion('1.0')
    .addTag('lms')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('app', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
