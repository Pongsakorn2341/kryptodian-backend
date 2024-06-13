import { Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { CacheService } from 'src/cache/cache.service';
import { EnvConfigProps } from 'src/common/config/env.config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CoinMarketCapService {
  constructor(
    private readonly configService: ConfigService<EnvConfigProps>,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
    private readonly prismaService: PrismaService,
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

  // TODO : implment coin marketcap
  //   async getCoinData(coinId: string) {}
}
