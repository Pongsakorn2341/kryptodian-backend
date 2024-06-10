import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CacheModule } from 'src/cache/cache.module';
import { CoinsService } from 'src/coins/coins.service';
import { TokenModule } from 'src/token/token.module';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';

@Module({
  imports: [TokenModule, HttpModule, CacheModule],
  controllers: [PortfolioController],
  providers: [PortfolioService, CoinsService],
})
export class PortfolioModule {}
