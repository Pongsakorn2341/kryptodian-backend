import { Controller, Get, Param } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coinsService.findOne(id);
  }
}
