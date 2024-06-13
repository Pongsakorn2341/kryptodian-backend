import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CryptoProviderService } from './crypto-provider.service';

@Controller({
  version: '1',
  path: 'crypto-provider',
})
@ApiBearerAuth()
@ApiTags('Crypto Provider')
export class CryptoProviderController {
  constructor(private readonly cryptoProviderService: CryptoProviderService) {}

  @Get(`/network`)
  @ApiOperation({ summary: `List a supports network` })
  async listNetworks() {
    return await this.cryptoProviderService.getNetworks();
  }
}
