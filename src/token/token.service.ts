import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { CacheService } from 'src/cache/cache.service';
import { EnvConfigProps } from 'src/common/config/env.config';
import {
  IGeckoNetwork,
  IGeckoNetworkResponse,
} from 'src/common/types/coin-gecko/network';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  IGeckoToken,
  IGeckoTokenResponse,
} from 'src/common/types/coin-gecko/token';

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

  private async getCoinData(
    userId: string,
    portfolioId: string,
    networkId: string,
    address: string,
  ): Promise<IGeckoToken> {
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
    await this.cacheService.setCache(tokenCacheKey, res);

    const coinData = await this.prismaService.coin.findFirst({
      where: {
        network_id: networkId,
        address: address,
        created_by: userId,
      },
    });
    if (!coinData) {
      await this.prismaService.coin.create({
        data: {
          name: res.attributes.name,
          reference_id: networkId,
          network_id: networkId,
          address: address,
          portfolio_id: portfolioId,
          created_by: userId,
        },
      });
    }

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
      userId,
      createTokenDto.portfolio_id,
      createTokenDto.network_id,
      createTokenDto.address,
    );

    return coinData;
  }

  private async retriveNetworkList(): Promise<IGeckoNetwork[]> {
    const url = `${this.geckoApiURL}/onchain/networks`;
    const cacheName = `gecko-network-list`;
    const cacheData = await this.cacheService.getCache(cacheName);
    if (cacheData) {
      return cacheData;
    }
    const response = await firstValueFrom(
      this.httpService.get<IGeckoNetworkResponse>(url, this.axiosConfig),
    );
    const result = response.data.data;
    await this.cacheService.setCache(cacheName, result);
    return result;
  }

  findAll() {
    return `This action returns all token`;
  }

  findOne(id: number) {
    return `This action returns a #${id} token`;
  }

  update(id: number, updateTokenDto: UpdateTokenDto) {
    return `This action updates a #${id} token`;
  }

  remove(id: number) {
    return `This action removes a #${id} token`;
  }
}
