import { Module } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { CoinsController } from './coins.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports: [HttpModule, CacheModule.register()],
  controllers: [CoinsController],
  providers: [CoinsService, CacheService],
})
export class CoinsModule {}
