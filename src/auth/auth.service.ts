import { Injectable } from '@nestjs/common';
import { buildResponse } from 'common/response';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

import { db } from 'src/db';
import { users } from 'src/db/schema';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class AuthService {
  async create(createAuthDto: CreateAuthDto) {
    const payload = {
      ...createAuthDto,
      id: uuidv7(),
    };

    const [newUser] = await db.insert(users).values(payload).returning();

    return buildResponse('User created successfully', newUser);
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: string) {
    return `This action returns a #${id} auth`;
  }

  update(id: string, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: string) {
    return `This action removes a #${id} auth`;
  }
}
