import { Module } from '@nestjs/common';

import { CacheModule as CacheManagerModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';
@Module({
  controllers: [],
  providers: [CacheService],
  imports: [
    CacheManagerModule.registerAsync({
      useFactory: async () => {
        return {
          store: 'memory',
          isGlobal: true,
          ttl: 60000,
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [CacheService],
})
export class CacheModule {}
