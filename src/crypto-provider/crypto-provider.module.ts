import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CacheModule } from 'src/cache/cache.module';
import { CoinMarketCapService } from './coin-marketcap/coin-marketcap.service';
import { CryptoProviderService } from './crypto-provider.service';
import { GeckoService } from './gecko/gecko.service';

@Module({
  imports: [HttpModule, CacheModule],
  providers: [CryptoProviderService, GeckoService, CoinMarketCapService],
  exports: [CryptoProviderModule],
})
export class CryptoProviderModule {}
