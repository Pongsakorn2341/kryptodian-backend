import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  network_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;
}
