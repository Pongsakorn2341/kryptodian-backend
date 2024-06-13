import { Injectable } from '@nestjs/common';
import { GeckoService } from './gecko/gecko.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CryptoProviderService {
  constructor(
    private readonly geckoService: GeckoService,
    private readonly prismaService: PrismaService,
  ) {}

  async getCoinData(coinId: string) {
    const coinData = await this.prismaService.coin.findUnique({
      where: {
        id: coinId,
      },
    });
    if (!coinData) {
      throw new Error(`Coin is not found`);
    }
    return await this.geckoService.getCoinData(
      coinData.network_id,
      coinData.address,
    );
  }

  async getCoinDataByNetwork(networkId: string, address: string) {
    return await this.geckoService.getCoinData(networkId, address);
  }

  async getNetworks() {
    return await this.geckoService.getNetworkList();
  }
}
