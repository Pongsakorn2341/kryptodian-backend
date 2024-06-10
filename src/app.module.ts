import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, HttpAdapterHost } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfigProps, envConfigObject } from './common/config/env.config';
import { TokenModule } from './token/token.module';
import { JoiValidation } from './common/config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/role.guard';
import { AuthModule } from './auth/auth.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { CoinsModule } from './coins/coins.module';
import { CacheModule } from './cache/cache.module';

const configOptionForRoot = {
  load: [envConfigObject],
  cache: true,
  isGlobal: true,
};

@Module({
  imports: [
    CacheModule,
    ConfigModule.forRoot({
      ...configOptionForRoot,
      validationSchema: JoiValidation,
      validationOptions: {
        abortEarly: false,
        debug: true,
        stack: true,
      },
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<EnvConfigProps>) => {
        return {
          global: true,
          secret: configService.get<string>('envConfig.JWT_SECRET'),
        };
      },
      inject: [ConfigService],
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
    AuthModule,
    PrismaModule,
    TokenModule,
    PortfolioModule,
    CoinsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
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
