import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { CacheService } from 'src/cache/cache.service';
import { EnvConfigProps } from 'src/common/config/env.config';
import { IGeckoCoin } from 'src/common/types/coin-gecko/coin';

@Injectable()
export class CoinsService {
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

  async findAll(): Promise<IGeckoCoin[]> {
    const query = new URLSearchParams({
      include_platform: 'true',
      status: 'active',
    });
    const cacheKey = `gecko-coin-list-total`;
    const cacheData = await this.cacheService.getCache<IGeckoCoin[]>(cacheKey);
    if (cacheData) {
      return cacheData;
    }
    const url = `${this.geckoApiURL}/coins/list?${query.toString()}`;
    const response = await firstValueFrom(
      this.httpService.get<IGeckoCoin[]>(url, this.axiosConfig),
    );
    const result = response.data;
    await this.cacheService.setCache(cacheKey, result);
    return result;
  }

  async findOne(id: string) {
    const lists = await this.findAll();
    return lists.find((item) => item.id == id);
  }

  async getPrices(ids: string[]): Promise<IGeckoCoin[]> {
    const query = new URLSearchParams({
      ids: ids.join(','),
      vs_currencies: 'btc',
      include_24hr_change: 'true',
    });
    const cacheKey = `gecko-coin-price_${ids.join('-')}`;
    const cacheData = await this.cacheService.getCache<IGeckoCoin[]>(cacheKey);
    if (cacheData) {
      return cacheData;
    }

    const url = `${this.geckoApiURL}/simple/price?${query.toString()}`;
    const response = await firstValueFrom(
      this.httpService.get<IGeckoCoin[]>(url, this.axiosConfig),
    );
    const result = response.data;
    console.log('🚀 ~ CoinsService ~ getPrices ~ result:', result);
    await this.cacheService.setCache(cacheKey, result);
    return result;
  }
}
