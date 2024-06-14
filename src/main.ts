import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/exception/all-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  const httpAdapter = app.get(HttpAdapterHost);
  const logger = new Logger(AppModule.name);
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

  const config = new DocumentBuilder()
    .setTitle('Kryptodian Backend')
    .setDescription('The decentralized autonomouse API description')
    .setVersion('1.0')
    .addTag('Kryptodian')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const docuemntURL = 'api-documents';
  SwaggerModule.setup(docuemntURL, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
    },
  });

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  logger.verbose(
    `Swagger Document is started at : ${process.env.BASE_ENDPOINT}/${docuemntURL}`,
  );
}
bootstrap();
