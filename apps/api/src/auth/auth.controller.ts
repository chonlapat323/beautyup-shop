import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { loginInput } from '@beautyup/types';
import type { z } from 'zod';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { AdminGuard, CurrentUser } from './auth.guard.js';
import { AuthService, type AuthUser } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body(new ZodValidationPipe(loginInput)) body: z.output<typeof loginInput>) {
    return this.auth.login(body.email, body.password);
  }

  @Get('me')
  @UseGuards(AdminGuard)
  me(@CurrentUser() user: AuthUser) {
    return user;
  }
}
