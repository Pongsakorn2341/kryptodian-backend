import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  IUserJwt,
} from 'src/common/decorators/current-user.decorators';
import { Public } from '../common/decorators/auth.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Body() body: LoginDto) {
    return await this.authService.signIn(body);
  }

  @Public()
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Patch('profile')
  updateProfile(
    @CurrentUser() userData: IUserJwt,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(userData.id, dto);
  }
}
