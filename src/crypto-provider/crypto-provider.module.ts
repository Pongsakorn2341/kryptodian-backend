import { Module } from '@nestjs/common';
import { CryptoProviderService } from './crypto-provider.service';
import { CryptoProviderController } from './crypto-provider.controller';
import { GeckoService } from './gecko/gecko.service';
import { CoinMarketCapService } from './coin-marketcap/coin-marketcap.service';

@Module({
  controllers: [CryptoProviderController],
  providers: [CryptoProviderService, GeckoService, CoinMarketCapService],
})
export class CryptoProviderModule {}
