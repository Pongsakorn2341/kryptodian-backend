import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FindManyTransactionDto } from './dto/get-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const portfolioData = await this.prismaService.portfolio.findUnique({
      where: {
        id: createTransactionDto.portfolio_id,
        created_by: userId,
      },
      include: {
        Coins: true,
      },
    });
    if (!portfolioData) {
      throw new Error(`Portfolio is not found`);
    }

    const coinData = portfolioData.Coins.find(
      (item) => item.id == createTransactionDto.coin_id,
    );
    if (!coinData) {
      throw new Error(`Invalid coin data`);
    }
    const txData = await this.prismaService.transaction.create({
      data: {
        action: createTransactionDto.action,
        action_at: createTransactionDto.action_date,
        currency_id: createTransactionDto.currency_id,
        coin_id: coinData.id,
        amount: createTransactionDto.amount,
        price: createTransactionDto.price,
        total: createTransactionDto.amount * createTransactionDto.price,
        portfolio_id: createTransactionDto.portfolio_id,
        created_by: userId,
      },
    });
    return txData;
  }

  async findAll(userId: string, dto: FindManyTransactionDto) {
    const whereCause: Prisma.TransactionWhereInput = {
      created_by: userId,
    };
    if (dto.portfolio_id) {
      whereCause.portfolio_id = dto.portfolio_id;
    }
    const transactions = await this.prismaService.transaction.findMany({
      where: whereCause,
    });
    return transactions;
  }

  async update(
    userId: string,
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const transactionData = await this.prismaService.transaction.findUnique({
      where: {
        id: id,
        created_by: userId,
      },
    });
    if (!transactionData) {
      throw new Error(`Transaction is not found`);
    }
    const updatedRecord = await this.prismaService.transaction.update({
      where: {
        id: transactionData.id,
      },
      data: {
        action: updateTransactionDto.action,
        action_at: updateTransactionDto.action_date,
        currency_id: updateTransactionDto.currency_id,
        amount: updateTransactionDto.amount,
        price: updateTransactionDto.price,
        total: updateTransactionDto.amount * updateTransactionDto.price,
      },
    });
    return updatedRecord;
  }
  Ò;
  async remove(userId: string, id: string) {
    const txRecord = await this.prismaService.transaction.findUnique({
      where: {
        id: id,
        created_by: userId,
      },
    });
    if (!txRecord) {
      throw new Error(`Transaction record is not found`);
    }
    const deleted = await this.prismaService.transaction.delete({
      where: {
        id: txRecord.id,
        created_by: userId,
      },
    });
    return deleted;
  }
}
