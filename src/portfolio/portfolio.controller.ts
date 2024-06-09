import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import {
  CurrentUser,
  IUserJwt,
} from 'src/common/decorators/current-user.decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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
}
