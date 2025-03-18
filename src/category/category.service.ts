import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { buildResponse, buildResponseMeta } from 'common/response';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { db } from 'src/db';
import { categories } from 'src/db/schema';
import { and, count, gte, ilike, lte, asc, eq, isNull } from 'drizzle-orm';

import { Filters, Paginations } from 'types/filter.type';
import { v7 as uuidv7 } from 'uuid';
import { Category } from 'types/category.type';
import { generateDate } from 'common/datetime';

@Injectable()
export class CategoryService {
  async create(createCategoryDto: CreateCategoryDto) {
    const payload = {
      ...createCategoryDto,
      name: createCategoryDto.name.toLowerCase(),
      id: uuidv7(),
    };

    await this.checkName(createCategoryDto.name);

    const [newCategories] = await db
      .insert(categories)
      .values(payload)
      .returning();

    return buildResponse('Categories created successfully', newCategories);
  }

  async findAll(filters: Filters, pagination: Paginations) {
    const { start_date, end_date, name } = filters;
    const { page = 1, per_page = 10 } = pagination;

    const whereConditions = [
      start_date &&
        gte(categories.created_at, new Date(start_date).toISOString()),
      end_date && lte(categories.created_at, new Date(end_date).toISOString()),
      name && ilike(categories.name, `%${name}%`),
      isNull(categories.deleted_at),
    ].filter(Boolean);

    const where = whereConditions.length ? and(...whereConditions) : undefined;

    const [getCategories, totalResult] = await Promise.all([
      db
        .select()
        .from(categories)
        .where(where)
        .orderBy(asc(categories.id))
        .limit(Number(per_page))
        .offset((page - 1) * per_page),

      db.select({ count: count() }).from(categories).where(where),
    ]);

    return buildResponseMeta('Categories found', getCategories, {
      total: totalResult[0]?.count ?? 0,
      page: Number(page),
      per_page: Number(per_page),
    });
  }

  async findOne(id: string) {
    const [getCategory] = await db
      .select()
      .from(categories)
      .where(and(eq(categories.id, id), isNull(categories.deleted_at)))
      .limit(1);

    if (!getCategory) {
      throw new NotFoundException('Category not found');
    }

    return buildResponse('Category found', getCategory);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.checkID(id);
    await this.checkName(updateCategoryDto.name);

    const [updateCategories] = await db
      .update(categories)
      .set({
        ...updateCategoryDto,
      })
      .where(and(eq(categories.id, id), isNull(categories.deleted_at)))
      .returning();

    return buildResponse('Categories updated successfully', updateCategories);
  }

  async remove(id: string) {
    const getCategory = await this.checkID(id);
    const updateData: Category = {
      ...getCategory,
      deleted_at: generateDate(),
    };

    const [removeCategories] = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();

    return buildResponse('Categories deleted successfully', removeCategories);
  }

  async checkName(name: string) {
    const [getCategory] = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.name, name.toLowerCase()),
          isNull(categories.deleted_at),
        ),
      )
      .limit(1);

    if (getCategory) {
      throw new ConflictException('Category name already exists');
    }
  }

  async checkID(id: string) {
    const [getCategory] = await db
      .select()
      .from(categories)
      .where(and(eq(categories.id, id), isNull(categories.deleted_at)))
      .limit(1);

    if (!getCategory) {
      throw new NotFoundException('Category not found');
    }

    return getCategory;
  }
}
