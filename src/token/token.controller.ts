import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { TokenService } from './token.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  IUserJwt,
} from 'src/common/decorators/current-user.decorators';

@Controller({
  version: '1',
  path: 'token',
})
@ApiBearerAuth()
@ApiTags('Token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  create(
    @Body() createTokenDto: CreateTokenDto,
    @CurrentUser() userData: IUserJwt,
  ) {
    return this.tokenService.create(userData.id, createTokenDto);
  }

  @Get()
  findAll() {
    return this.tokenService.findAll();
  }
}
