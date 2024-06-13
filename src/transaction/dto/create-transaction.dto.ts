import { ApiProperty } from '@nestjs/swagger';
import { EAction } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  portfolio_id: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  action_date: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  coin_id: string;

  @ApiProperty({ enum: EAction })
  @IsEnum(EAction)
  @IsNotEmpty()
  action: EAction;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  @IsNotEmpty()
  price: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Min(0, { message: 'Amount must be greater than or equal to 0' })
  @IsNotEmpty()
  amount: number;

  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // currency_id: string;
}
