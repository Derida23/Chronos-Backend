import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { db } from 'src/db';
import { users } from 'src/db/schema';
import { and, gte, ilike, isNull, lte, asc, count, eq } from 'drizzle-orm';
import { buildResponse, buildResponseMeta } from 'common/response';
import { Filters, Paginations } from 'types/filter.type';
import { v7 as uuidv7 } from 'uuid';
import { hashPassword } from 'common/hash';
import { generateDate } from 'common/datetime';
import { RequestUser } from 'types/request.type';

@Injectable()
export class ProfileService {
  async create(createProfileDto: CreateProfileDto) {
    await this.checkEmail(createProfileDto.email);

    const id = uuidv7();
    const password = await hashPassword(createProfileDto.password);

    const payload = {
      ...createProfileDto,
      id,
      password,
    };

    const [newUser] = await db.insert(users).values(payload).returning();

    return buildResponse('User created successfully', newUser);
  }

  async findAll(filters: Filters, pagination: Paginations) {
    const { start_date, end_date, name } = filters;
    const { page = 1, per_page = 10 } = pagination;

    const whereConditions = [
      start_date && gte(users.created_at, new Date(start_date).toISOString()),
      end_date && lte(users.created_at, new Date(end_date).toISOString()),
      name && ilike(users.name, `%${name}%`),
      isNull(users.deleted_at),
    ].filter(Boolean);

    const where = whereConditions.length ? and(...whereConditions) : undefined;

    const [getProfiles, totalResult] = await Promise.all([
      db
        .select()
        .from(users)
        .where(where)
        .orderBy(asc(users.id))
        .limit(Number(per_page))
        .offset((page - 1) * per_page),

      db.select({ count: count() }).from(users).where(where),
    ]);

    getProfiles.forEach((profile) => delete profile.password);

    return buildResponseMeta('User found', getProfiles, {
      total: totalResult[0]?.count ?? 0,
      page: Number(page),
      per_page: Number(per_page),
    });
  }

  async findOne(id: string) {
    const [getProfile] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deleted_at)))
      .limit(1);

    if (!getProfile) {
      throw new NotFoundException('User not found');
    }

    return buildResponse('User found', getProfile);
  }

  async findMe(user: RequestUser) {
    const id: string = user.id;

    const [getMe] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deleted_at)))
      .limit(1);

    if (!getMe) {
      throw new NotFoundException('User not found');
    }

    delete getMe.password;

    return buildResponse('User found', getMe);
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    await this.checkID(id);

    const [updateProfile] = await db
      .update(users)
      .set({
        ...updateProfileDto,
      })
      .where(and(eq(users.id, id), isNull(users.deleted_at)))
      .returning();

    return buildResponse('User updated successfully', updateProfile);
  }

  async remove(id: string) {
    const getProfile = await this.checkID(id);
    const updateData = {
      ...getProfile,
      deleted_at: generateDate(),
    };

    const [removeProfile] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    return buildResponse('User deleted successfully', removeProfile);
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

  async checkID(id: string) {
    const [getProfile] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deleted_at)))
      .limit(1);

    if (!getProfile) {
      throw new NotFoundException('User not found');
    }

    return getProfile;
  }
}
