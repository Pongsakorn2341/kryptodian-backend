import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCoinDto {
  @ApiProperty({ default: 'eth' })
  @IsString()
  @IsNotEmpty()
  network_id: string;

  @ApiProperty({ default: '0xdac17f958d2ee523a2206206994597c13d831ec7' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  portfolio_id: string;
}
