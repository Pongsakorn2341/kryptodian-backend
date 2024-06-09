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
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async create(createTokenDto: CreateTokenDto) {
    const response = await this.retriveNetworkList();
    const isNetworkNameAvailable = response.find(
      (item) => item.id == createTokenDto.network_id,
    );
    if (!isNetworkNameAvailable) {
      throw new Error(`This network is not avaiable.`);
    }
    return response;
  }

  private async retriveNetworkList(): Promise<IGeckoNetwork[]> {
    const url = `${this.geckoApiURL}/onchain/networks?x-cg-pro-api-key=${this.geckoApiKey}`;
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
