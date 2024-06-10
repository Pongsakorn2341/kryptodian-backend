import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CoinsService } from './coins.service';
import { CoinPriceDto } from './dto/find-coin.dto';

@Controller({
  version: '1',
  path: 'coins',
})
@ApiBearerAuth()
@ApiTags('Coins')
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  @Get()
  findAll() {
    return this.coinsService.findAll();
  }

  @Get('/price')
  getCoinPrices(@Query() dto: CoinPriceDto) {
    const ids = dto.ids
      .split(',')
      .map((id) => id.trim())
      .filter((item) => item);
    return this.coinsService.getPrices(ids);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coinsService.findOne(id);
  }
}
