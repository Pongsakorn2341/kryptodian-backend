import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAuthDto } from './create-auth.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}

export class UpdateProfileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  profile_url: string;
}
