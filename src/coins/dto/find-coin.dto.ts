import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CoinPriceDto {
  @ApiProperty({ required: true, default: 'bitcoin' })
  @IsString()
  @IsNotEmpty()
  ids: string;
}
