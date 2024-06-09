import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/exception/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  const httpAdapter = app.get(HttpAdapterHost);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
}
bootstrap();
