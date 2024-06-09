import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports: [HttpModule, CacheModule.register()],
  controllers: [TokenController],
  providers: [TokenService, CacheService],
})
export class TokenModule {}
