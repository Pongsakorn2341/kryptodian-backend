import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenModule } from './token/token.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, HttpAdapterHost } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envConfigObject } from './common/config/env.config';
import { JoiValidation } from './common/config/env.validation';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';

const configOptionForRoot = {
  load: [envConfigObject],
  cache: true,
  isGlobal: true,
};

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get<string>('envConfig.jwt_secret'),
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      ...configOptionForRoot,
      validationSchema: JoiValidation,
      validationOptions: {
        abortEarly: false,
        debug: true,
        stack: true,
      },
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short-period',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium-period',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long-period',
        ttl: 60000,
        limit: 100,
      },
    ]),
    HttpModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerModule,
    },
    {
      provide: APP_FILTER,
      useClass: HttpAdapterHost,
    },
  ],
})
export class AppModule {}
