import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenModule } from './token/token.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
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
    TokenModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerModule,
    },
  ],
})
export class AppModule {}
