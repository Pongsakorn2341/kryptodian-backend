import { Controller } from '@nestjs/common';
import { CryptoProviderService } from './crypto-provider.service';

@Controller('crypto-provider')
export class CryptoProviderController {
  constructor(private readonly cryptoProviderService: CryptoProviderService) {}
}
