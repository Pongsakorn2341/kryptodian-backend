import { Injectable } from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenSerivce: TokenService,
  ) {}

  async create(userId: string, createPortfolioDto: CreatePortfolioDto) {
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
    const coins = await Promise.all(
      portDat.Coins.map(async (coinData) => {
        const _coinData = { ...coinData, coinData: null };
        _coinData.coinData = await this.tokenSerivce.getCoinData(
          userId,
          portDat.id,
          coinData.network_id,
          coinData.address,
        );
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
  }
}
