import { ConflictException, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { MemberProfile } from '@beautyup/types';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import type { Member } from '../generated/prisma/client.js';
import type { JwtPayload } from '../auth/auth.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);
const MEMBER_TOKEN_TTL = '30d';

@Injectable()
export class MembersService {
  private readonly googleClient = new OAuth2Client();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(input: { name: string; email: string; password: string; locale: string }) {
    const email = input.email.toLowerCase();
    const existing = await this.prisma.member.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException({
        statusCode: 409,
        code: existing.passwordHash ? 'EMAIL_TAKEN' : 'EMAIL_USES_GOOGLE',
        message: existing.passwordHash ? 'อีเมลนี้สมัครสมาชิกแล้ว' : 'อีเมลนี้สมัครด้วย Google กรุณาเข้าสู่ระบบด้วย Google',
      });
    }
    const member = await this.prisma.member.create({
      data: {
        email,
        name: input.name,
        locale: input.locale,
        passwordHash: await bcrypt.hash(input.password, 10),
        lastLoginAt: new Date(),
      },
    });
    return this.session(member);
  }

  async login(emailRaw: string, password: string) {
    const member = await this.prisma.member.findUnique({ where: { email: emailRaw.toLowerCase() } });
    const ok = await bcrypt.compare(password, member?.passwordHash ?? DUMMY_HASH);
    if (!member || !member.passwordHash || !ok) {
      throw new UnauthorizedException({ statusCode: 401, code: 'INVALID_LOGIN', message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }
    return this.session(await this.touch(member.id));
  }

  /** Verifies a Google ID token, then signs in, links by email, or creates the member. */
  async google(credential: string, locale: string) {
    const audience = process.env.GOOGLE_CLIENT_ID;
    if (!audience) throw new ServiceUnavailableException('Google sign-in is not configured (GOOGLE_CLIENT_ID)');

    let payload;
    try {
      payload = (await this.googleClient.verifyIdToken({ idToken: credential, audience })).getPayload();
    } catch {
      throw new UnauthorizedException({ statusCode: 401, code: 'INVALID_GOOGLE', message: 'ยืนยันตัวตนกับ Google ไม่สำเร็จ' });
    }
    if (!payload?.sub || !payload.email || !payload.email_verified) {
      throw new UnauthorizedException({ statusCode: 401, code: 'INVALID_GOOGLE', message: 'บัญชี Google นี้ยังไม่ยืนยันอีเมล' });
    }

    const email = payload.email.toLowerCase();
    const byGoogle = await this.prisma.member.findUnique({ where: { googleId: payload.sub } });
    if (byGoogle) return this.session(await this.touch(byGoogle.id));

    // Same verified email already registered with a password: link the Google account
    const byEmail = await this.prisma.member.findUnique({ where: { email } });
    const member = byEmail
      ? await this.prisma.member.update({
          where: { id: byEmail.id },
          data: { googleId: payload.sub, avatarUrl: byEmail.avatarUrl || (payload.picture ?? ''), lastLoginAt: new Date() },
        })
      : await this.prisma.member.create({
          data: {
            email,
            googleId: payload.sub,
            name: payload.name || email.split('@')[0],
            avatarUrl: payload.picture ?? '',
            locale,
            lastLoginAt: new Date(),
          },
        });
    return this.session(member);
  }

  async verify(token: string): Promise<Member> {
    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException();
    }
    if (payload.kind !== 'member') throw new UnauthorizedException();
    const member = await this.prisma.member.findUnique({ where: { id: payload.sub } });
    if (!member) throw new UnauthorizedException();
    return member;
  }

  async updateProfile(id: string, data: { name: string; phone: string; shopName: string; province: string }) {
    return toProfile(await this.prisma.member.update({ where: { id }, data }));
  }

  private touch(id: string) {
    return this.prisma.member.update({ where: { id }, data: { lastLoginAt: new Date() } });
  }

  private async session(member: Member) {
    const payload: JwtPayload = { sub: member.id, kind: 'member' };
    return {
      accessToken: await this.jwt.signAsync(payload, { expiresIn: MEMBER_TOKEN_TTL }),
      member: toProfile(member),
    };
  }
}

export function toProfile(m: Member): MemberProfile {
  return {
    id: m.id,
    email: m.email,
    name: m.name,
    phone: m.phone,
    shopName: m.shopName,
    province: m.province,
    avatarUrl: m.avatarUrl,
    hasPassword: Boolean(m.passwordHash),
    hasGoogle: Boolean(m.googleId),
    createdAt: m.createdAt.toISOString(),
  };
}
