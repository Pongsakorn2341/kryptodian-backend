import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [AuthService, PrismaService, JwtService],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [HttpModule],
})
export class AuthModule {}
