import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { CacheService } from 'src/cache/cache.service';
import { EnvConfigProps } from 'src/common/config/env.config';
import {
  IGeckoNetwork,
  IGeckoNetworkResponse,
} from 'src/common/types/coin-gecko/network';
import {
  IGeckoToken,
  IGeckoTokenResponse,
} from 'src/common/types/coin-gecko/token';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTokenDto } from './dto/create-token.dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService<EnvConfigProps>,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
    private readonly prismaService: PrismaService,
  ) {}
  private readonly logger = new Logger(TokenService.name);
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

  async getCoinData(networkId: string, address: string): Promise<IGeckoToken> {
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

  async create(userId: string, createTokenDto: CreateTokenDto) {
    const portfolioData = await this.prismaService.portfolio.findUnique({
      where: {
        id: createTokenDto.portfolio_id,
      },
      include: {
        Coins: true,
      },
    });
    if (!portfolioData) {
      throw new Error(`Portfolio is not found.`);
    }
    const isAdded = portfolioData.Coins.find(
      (item) =>
        item.network_id == createTokenDto.network_id &&
        item.address == createTokenDto.address,
    );
    if (isAdded) {
      throw new Error(`This coin is already added`);
    }

    const response = await this.retriveNetworkList();
    const isNetworkNameAvailable = response.find(
      (item) => item.id == createTokenDto.network_id,
    );
    if (!isNetworkNameAvailable) {
      throw new Error(`${createTokenDto.network_id} network is not avaiable.`);
    }

    const coinData = await this.getCoinData(
      createTokenDto.network_id,
      createTokenDto.address,
    );

    const coinRecord = await this.prismaService.coin.findFirst({
      where: {
        portfolio_id: userId,
        network_id: createTokenDto.network_id,
        address: createTokenDto.address,
        created_by: userId,
      },
    });
    if (!coinRecord) {
      await this.prismaService.coin.create({
        data: {
          name: coinData.attributes.name,
          reference_id: createTokenDto.network_id,
          network_id: createTokenDto.network_id,
          address: createTokenDto.address,
          portfolio_id: createTokenDto.portfolio_id,
          created_by: userId,
        },
      });
    }

    return coinData;
  }

  async getNetworks(page: number): Promise<IGeckoNetwork[]> {
    const url = `${this.geckoApiURL}/onchain/networks?page=${page}`;
    const response = await firstValueFrom(
      this.httpService.get<IGeckoNetworkResponse>(url, this.axiosConfig),
    );
    const result = response.data.data;
    return result;
  }

  async retriveNetworkList(): Promise<IGeckoNetwork[]> {
    const cacheName = `gecko-network-list`;
    const cacheData = await this.cacheService.getCache(cacheName);
    if (cacheData) {
      return cacheData;
    }
    const firstNetwork = await this.getNetworks(1);
    const secondNetwork = await this.getNetworks(2);
    const result = [...firstNetwork, ...secondNetwork];
    const cacheTTL = 1 * 60 * 60 * 1000;
    await this.cacheService.setCache(cacheName, result, cacheTTL);
    return result;
  }
}
