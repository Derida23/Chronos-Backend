import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { buildResponse } from 'common/response';
import { CreateAuthDto } from './dto/create-auth.dto';

import { db } from 'src/db';
import { users } from 'src/db/schema';
import { v7 as uuidv7 } from 'uuid';

import { comparePasswords, hashPassword } from 'common/hash';
import { eq, and, isNull } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(createAuthDto: CreateAuthDto) {
    await this.checkEmail(createAuthDto.email);

    const id = uuidv7();
    const password = await hashPassword(createAuthDto.password);

    const payload = {
      ...createAuthDto,
      id,
      password,
    };

    const [newUser] = await db.insert(users).values(payload).returning();

    return buildResponse('User created successfully', newUser);
  }

  async login({ email, password }: { email: string; password: string }) {
    await this.checkActive(email);

    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deleted_at)))
      .limit(1);

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return buildResponse('Login successfully', token);
  }

  async checkEmail(email: string) {
    const [getEmail] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deleted_at)))
      .limit(1);

    if (getEmail) {
      throw new ConflictException('Email already registered');
    }

    return getEmail;
  }

  async checkActive(email: string) {
    const [emailActive] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.email, email),
          isNull(users.deleted_at),
          eq(users.is_active, true),
        ),
      )
      .limit(1);

    if (!emailActive) {
      throw new NotFoundException('User not activated');
    }
  }
}
