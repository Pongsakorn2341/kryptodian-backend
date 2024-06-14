import { Injectable } from '@nestjs/common';
import { CoinsService } from 'src/coins/coins.service';
import { handleError } from 'src/common/utils/helper';
import { CryptoProviderService } from 'src/crypto-provider/crypto-provider.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddCoinDto } from './dto/add-coin.dto';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly coinService: CoinsService,
    private readonly cryptoProvider: CryptoProviderService,
  ) {}

  async create(userId: string, createPortfolioDto: CreatePortfolioDto) {
    const currentPorts = await this.prismaService.portfolio.count({
      where: {
        created_by: userId,
      },
    });
    if (currentPorts >= 5) {
      throw new Error(`Maximum Portfolio is 5`);
    }
    const result = await this.prismaService.portfolio.create({
      data: {
        name: createPortfolioDto.name,
        created_by: userId,
      },
    });
    return result;
  }

  async findAll(userId: string) {
    const response = await this.prismaService.portfolio.findMany({
      where: {
        created_by: userId,
      },
    });
    return response;
  }

  async findOne(userId: string, id: string) {
    const portDat = await this.prismaService.portfolio.findUnique({
      where: {
        id: id,
        created_by: userId,
      },
      include: {
        Coins: true,
      },
    });
    if (!portDat) {
      throw new Error(`Portfolio is not found`);
    }
    const coins = await Promise.all(
      portDat.Coins.map(async (coinData) => {
        const _coinData = { ...coinData, coinData: null, priceChange: null };
        const coinAttribute = await this.cryptoProvider.getCoinData(
          coinData.id,
        );
        _coinData.coinData = coinAttribute;
        _coinData.priceChange = await this.coinService.getPrices([
          coinAttribute?.attributes?.coingecko_coin_id,
        ]);
        return _coinData;
      }),
    );
    portDat.Coins = coins;
    return portDat;
  }

  async update(
    userId: string,
    id: string,
    updatePortfolioDto: UpdatePortfolioDto,
  ) {
    const portData = await this.prismaService.portfolio.findUnique({
      where: {
        id: id,
        created_by: userId,
      },
    });
    if (!portData) {
      throw new Error(`Portfolio is not found or you're not owned.`);
    }
    const result = await this.prismaService.portfolio.update({
      where: {
        id: id,
        created_by: userId,
      },
      data: {
        name: updatePortfolioDto.name,
      },
    });
    return result;
  }

  async remove(userId: string, id: string) {
    try {
      const portData = await this.prismaService.portfolio.findUnique({
        where: {
          id: id,
          created_by: userId,
        },
      });
      if (!portData) {
        throw new Error(`Portfolio is not found or you're not owned.`);
      }
      const result = await this.prismaService.portfolio.delete({
        where: {
          id: id,
          created_by: userId,
        },
      });
      return result;
    } catch (e) {
      handleError(e, { isThrowError: true });
    }
  }

  async removeCoin(userId: string, portId: string, coinId: string) {
    try {
      const portData = await this.prismaService.portfolio.findUnique({
        where: {
          id: portId,
          created_by: userId,
        },
      });
      if (!portData) {
        throw new Error(`Portfolio is not found`);
      }
      const coinData = await this.prismaService.coin.delete({
        where: {
          id: coinId,
          created_by: userId,
        },
      });
      if (!coinData) {
        throw new Error(`Remove coin from ${portData.name} failed.`);
      }
      return coinData;
    } catch (e) {
      handleError(e, { isThrowError: true });
    }
  }

  async addCoin(userId: string, addCoinDto: AddCoinDto) {
    const portfolioData = await this.prismaService.portfolio.findUnique({
      where: {
        id: addCoinDto.portfolio_id,
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
        item.network_id == addCoinDto.network_id &&
        item.address == addCoinDto.address,
    );
    if (isAdded) {
      throw new Error(`This coin is already added`);
    }

    const response = await this.cryptoProvider.getNetworks();
    const isNetworkNameAvailable = response.find(
      (item) => item.id == addCoinDto.network_id,
    );
    if (!isNetworkNameAvailable) {
      throw new Error(`${addCoinDto.network_id} network is not avaiable.`);
    }

    const coinData = await this.cryptoProvider.getCoinDataByNetwork(
      addCoinDto.network_id,
      addCoinDto.address,
    );

    const coinRecord = await this.prismaService.coin.findFirst({
      where: {
        portfolio_id: userId,
        network_id: addCoinDto.network_id,
        address: addCoinDto.address,
        created_by: userId,
      },
    });
    if (!coinRecord) {
      await this.prismaService.coin.create({
        data: {
          name: coinData.attributes.name,
          reference_id: addCoinDto.network_id,
          network_id: addCoinDto.network_id,
          address: addCoinDto.address,
          portfolio_id: addCoinDto.portfolio_id,
          created_by: userId,
        },
      });
    }

    return coinData;
  }
}
