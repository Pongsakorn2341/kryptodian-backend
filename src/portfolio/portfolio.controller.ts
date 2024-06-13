import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: `Create Portfolio` })
  create(
    @Body() createPortfolioDto: CreatePortfolioDto,
    @CurrentUser() userData: IUserJwt,
  ) {
    return this.portfolioService.create(userData.id, createPortfolioDto);
  }

  @Post('/add-coin')
  @ApiOperation({ summary: `Add coin in portfolio` })
  async addCoin(
    @CurrentUser() userData: IUserJwt,
    @Body() addCoinDto: AddCoinDto,
  ) {
    return this.portfolioService.addCoin(userData.id, addCoinDto);
  }

  @Get()
  @ApiOperation({ summary: `List all Portfolio` })
  findAll(@CurrentUser() userData: IUserJwt) {
    return this.portfolioService.findAll(userData.id);
  }

  @Get(':id')
  @ApiOperation({ summary: `Get Portfolio` })
  findOne(@Param('id') id: string, @CurrentUser() userData: IUserJwt) {
    return this.portfolioService.findOne(userData.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: `Update Portfolio` })
  update(
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @CurrentUser() userData: IUserJwt,
  ) {
    return this.portfolioService.update(userData.id, id, updatePortfolioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: `Delete Portfolio` })
  remove(@Param('id') id: string, @CurrentUser() userData: IUserJwt) {
    return this.portfolioService.remove(userData.id, id);
  }

  @Delete(':portId/coin/:coinId')
  @ApiOperation({ summary: `Remove coin from portfolio` })
  removeCoin(
    @Param('portId') portId: string,
    @Param('coinId') coinId: string,
    @CurrentUser() userData: IUserJwt,
  ) {
    return this.portfolioService.removeCoin(userData.id, portId, coinId);
  }
}
