import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { HttpService } from '@nestjs/axios';
import { EnvConfigProps } from 'src/common/config/env.config';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService<EnvConfigProps>,
    private readonly httpService: HttpService,
  ) {}
  private readonly logger = new Logger(TokenService.name);
  private readonly geckoApiURL = this.configService.get<string>(
    'envConfig.COIN_GECKO_API_URL',
  );

  create(createTokenDto: CreateTokenDto) {
    this.logger.log(this.geckoApiURL);
    return 'This action adds a new token';
  }

  findAll() {
    return `This action returns all token`;
  }

  findOne(id: number) {
    return `This action returns a #${id} token`;
  }

  update(id: number, updateTokenDto: UpdateTokenDto) {
    return `This action updates a #${id} token`;
  }

  remove(id: number) {
    return `This action removes a #${id} token`;
  }
}
