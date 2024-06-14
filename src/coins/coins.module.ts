import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CacheModule } from 'src/cache/cache.module';
import { CoinsController } from './coins.controller';
import { CoinsService } from './coins.service';

@Module({
  imports: [HttpModule, CacheModule],
  controllers: [CoinsController],
  providers: [CoinsService],
})
export class CoinsModule {}
