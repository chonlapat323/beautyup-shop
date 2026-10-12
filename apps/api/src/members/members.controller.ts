import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Injectable,
  Ip,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
  createParamDecorator,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { memberGoogleInput, memberLoginInput, memberProfileInput, memberRegisterInput } from '@beautyup/types';
import type { Request } from 'express';
import type { z } from 'zod';
import type { Member } from '../generated/prisma/client.js';
import { AdminGuard } from '../auth/auth.guard.js';
import { clientIp, throttle } from '../common/throttle.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { MembersService, toProfile } from './members.service.js';

type MemberRequest = Request & { member?: Member };

@Injectable()
export class MemberGuard implements CanActivate {
  constructor(private readonly members: MembersService) {}

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest<MemberRequest>();
    const [scheme, token] = (req.headers.authorization ?? '').split(' ');
    if (scheme !== 'Bearer' || !token) throw new UnauthorizedException();
    req.member = await this.members.verify(token);
    return true;
  }
}

const CurrentMember = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest<MemberRequest>().member,
);

/** 10 attempts per IP per 10 minutes for sign-in / sign-up. */
const limitAuth = (forwarded: string | undefined, ip: string) =>
  throttle(`member-auth:${clientIp(forwarded, ip)}`, 10, 10 * 60 * 1000);

@Controller('members')
export class MembersController {
  constructor(private readonly members: MembersService) {}

  @Post('register')
  register(
    @Body(new ZodValidationPipe(memberRegisterInput)) body: z.output<typeof memberRegisterInput>,
    @Ip() ip: string,
    @Headers('x-forwarded-for') fwd?: string,
  ) {
    limitAuth(fwd, ip);
    return this.members.register(body);
  }

  @Post('login')
  @HttpCode(200)
  login(
    @Body(new ZodValidationPipe(memberLoginInput)) body: z.output<typeof memberLoginInput>,
    @Ip() ip: string,
    @Headers('x-forwarded-for') fwd?: string,
  ) {
    limitAuth(fwd, ip);
    return this.members.login(body.email, body.password);
  }

  @Post('google')
  @HttpCode(200)
  google(
    @Body(new ZodValidationPipe(memberGoogleInput)) body: z.output<typeof memberGoogleInput>,
    @Ip() ip: string,
    @Headers('x-forwarded-for') fwd?: string,
  ) {
    limitAuth(fwd, ip);
    return this.members.google(body.credential, body.locale);
  }

  @Get('me')
  @UseGuards(MemberGuard)
  me(@CurrentMember() member: Member) {
    return toProfile(member);
  }

  @Put('me')
  @UseGuards(MemberGuard)
  update(
    @CurrentMember() member: Member,
    @Body(new ZodValidationPipe(memberProfileInput)) body: z.output<typeof memberProfileInput>,
  ) {
    return this.members.updateProfile(member.id, body);
  }
}

/** Read-only member list for the admin panel. */
@Controller('admin/members')
@UseGuards(AdminGuard)
export class AdminMembersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list() {
    const rows = await this.prisma.member.findMany({ orderBy: { createdAt: 'desc' } });
    return rows.map((m) => ({ ...toProfile(m), lastLoginAt: m.lastLoginAt?.toISOString() ?? null }));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.prisma.member.delete({ where: { id } });
    return { ok: true };
  }
}
