import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  IUserJwt,
} from 'src/common/decorators/current-user.decorators';
import { AddCoinDto } from './dto/add-coin.dto';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PortfolioService } from './portfolio.service';

@Controller({
  version: '1',
  path: 'portfolio',
})
@ApiBearerAuth()
@ApiTags('Portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  create(
    @Body() createPortfolioDto: CreatePortfolioDto,
    @CurrentUser() userData: IUserJwt,
  ) {
    return this.portfolioService.create(userData.id, createPortfolioDto);
  }

  @Post('/add')
  async addCoin(@CurrentUser() userData: IUserJwt, addCoinDto: AddCoinDto) {
    return this.portfolioService.addCoin(userData.id, addCoinDto);
  }

  @Get()
  findAll(@CurrentUser() userData: IUserJwt) {
    return this.portfolioService.findAll(userData.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() userData: IUserJwt) {
    return this.portfolioService.findOne(userData.id, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @CurrentUser() userData: IUserJwt,
  ) {
    return this.portfolioService.update(userData.id, id, updatePortfolioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() userData: IUserJwt) {
    return this.portfolioService.remove(userData.id, id);
  }

  @Delete(':portId/coin/:coinId')
  removeCoin(
    @Param('portId') portId: string,
    @Param('coinId') coinId: string,
    @CurrentUser() userData: IUserJwt,
  ) {
    return this.portfolioService.removeCoin(userData.id, portId, coinId);
  }
}
