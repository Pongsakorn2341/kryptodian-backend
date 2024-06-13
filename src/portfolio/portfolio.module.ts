import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CacheModule } from 'src/cache/cache.module';
import { CoinsService } from 'src/coins/coins.service';
import { CryptoProviderModule } from 'src/crypto-provider/crypto-provider.module';
import { CryptoProviderService } from 'src/crypto-provider/crypto-provider.service';
import { GeckoService } from 'src/crypto-provider/gecko/gecko.service';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';

@Module({
  imports: [HttpModule, CacheModule, CryptoProviderModule],
  controllers: [PortfolioController],
  providers: [
    PortfolioService,
    CoinsService,
    CryptoProviderService,
    GeckoService,
  ],
})
export class PortfolioModule {}
