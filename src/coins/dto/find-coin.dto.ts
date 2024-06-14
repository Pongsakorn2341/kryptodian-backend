import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CoinPriceDto {
  @ApiProperty({ required: true, default: 'bitcoin' })
  @IsString()
  @IsNotEmpty()
  ids: string;
}

export class FindManyCoinDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  network?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;
}
