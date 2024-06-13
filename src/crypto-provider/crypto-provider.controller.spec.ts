import { Test, TestingModule } from '@nestjs/testing';
import { CryptoProviderController } from './crypto-provider.controller';
import { CryptoProviderService } from './crypto-provider.service';

describe('CryptoProviderController', () => {
  let controller: CryptoProviderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoProviderController],
      providers: [CryptoProviderService],
    }).compile();

    controller = module.get<CryptoProviderController>(CryptoProviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
