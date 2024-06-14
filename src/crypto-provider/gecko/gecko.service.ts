import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { CacheService } from 'src/cache/cache.service';
import { EnvConfigProps } from 'src/common/config/env.config';
import { IGeckoCoin } from 'src/common/types/coin-gecko/coin';
import {
  IGeckoNetwork,
  IGeckoNetworkResponse,
} from 'src/common/types/coin-gecko/network';
import { IGeckoTokenResponse } from 'src/common/types/coin-gecko/token';

@Injectable()
export class GeckoService {
  constructor(
    private readonly configService: ConfigService<EnvConfigProps>,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
  ) {}

  private readonly geckoApiURL = this.configService.get<string>(
    'envConfig.COIN_GECKO_API_URL',
  );
  private readonly geckoApiKey = this.configService.get<string>(
    'envConfig.COIN_GECKO_API_KEY',
  );
  private readonly axiosConfig: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'x-cg-pro-api-key': this.geckoApiKey,
    },
  };

  async getCoinData(networkId: string, address: string) {
    const tokenCacheKey = `gecko-token-${networkId}-${address}`;
    const cacheVal = await this.cacheService.getCache(tokenCacheKey);
    if (cacheVal) {
      return cacheVal;
    }
    const url = `${this.geckoApiURL}/onchain/networks/${networkId}/tokens/${address}`;
    const getCoinData = await firstValueFrom(
      this.httpService.get<IGeckoTokenResponse>(url, this.axiosConfig),
    );
    const res = getCoinData?.data?.data;
    const cacheTTL = 5 * 60 * 1000;
    await this.cacheService.setCache(tokenCacheKey, res, cacheTTL);
    return res;
  }

  private async getNetworks(page: number): Promise<IGeckoNetwork[]> {
    const url = `${this.geckoApiURL}/onchain/networks?page=${page}`;
    const response = await firstValueFrom(
      this.httpService.get<IGeckoNetworkResponse>(url, this.axiosConfig),
    );
    const result = response.data.data;
    return result;
  }

  async getNetworkList() {
    const cacheName = `gecko-network-list`;
    const cacheData = await this.cacheService.getCache(cacheName);
    if (cacheData) {
      return cacheData;
    }
    let result = [];
    const totalNetworkPage = 2;
    for (let idx = 0; idx < totalNetworkPage; idx++) {
      const _r = await this.getNetworks(idx + 1);
      result = [...result, ..._r];
    }

    const cacheTTL = 1 * 60 * 60 * 1000;
    await this.cacheService.setCache(cacheName, result, cacheTTL);
    return result;
  }

  async getPriceTicker(geckoCoinId: number[]) {
    const query = new URLSearchParams({
      ids: geckoCoinId.join(','),
      vs_currencies: 'btc',
      include_24hr_change: 'true',
    });
    const cacheKey = `gecko-coin-price_${geckoCoinId.join('-')}`;
    const cacheData = await this.cacheService.getCache<IGeckoCoin[]>(cacheKey);
    if (cacheData) {
      return cacheData;
    }

    const url = `${this.geckoApiURL}/simple/price?${query.toString()}`;
    const response = await firstValueFrom(
      this.httpService.get<IGeckoCoin[]>(url, this.axiosConfig),
    );
    const result = response.data;
    await this.cacheService.setCache(cacheKey, result);
    return result;
  }
}
