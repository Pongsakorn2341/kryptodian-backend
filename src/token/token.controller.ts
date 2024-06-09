import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { TokenService } from './token.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller({
  version: '1',
  path: 'token',
})
@ApiBearerAuth()
@ApiTags('Token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  create(@Body() createTokenDto: CreateTokenDto) {
    return this.tokenService.create(createTokenDto);
  }

  @Get()
  findAll() {
    return this.tokenService.findAll();
  }
}
