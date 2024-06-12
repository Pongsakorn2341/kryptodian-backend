import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindManyTransactionDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  portfolio_id?: string;
}
