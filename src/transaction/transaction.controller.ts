import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  IUserJwt,
} from 'src/common/decorators/current-user.decorators';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FindManyTransactionDto } from './dto/get-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionService } from './transaction.service';

@Controller({
  version: '1',
  path: 'transaction',
})
@ApiBearerAuth()
@ApiTags('Transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @CurrentUser() userData: IUserJwt,
  ) {
    return this.transactionService.create(userData.id, createTransactionDto);
  }

  @Get()
  findAll(
    @CurrentUser() userData: IUserJwt,
    @Query() query: FindManyTransactionDto,
  ) {
    return this.transactionService.findAll(userData.id, query);
  }

  @Patch(':id')
  update(
    @CurrentUser() userData: IUserJwt,
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(
      userData.id,
      id,
      updateTransactionDto,
    );
  }

  @Delete(':id')
  remove(@CurrentUser() userData: IUserJwt, @Param('id') id: string) {
    return this.transactionService.remove(userData.id, id);
  }
}
