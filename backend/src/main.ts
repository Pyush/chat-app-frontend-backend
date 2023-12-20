import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: true,
    optionsSuccessStatus: 204,
    credentials: true,
  });
  console.log('DATABASE_URL', process.env.DATABASE_URL);
  console.log('JWT_SECRET', process.env.JWT_SECRET);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
