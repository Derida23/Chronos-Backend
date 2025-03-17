import { Injectable } from '@nestjs/common';
import { buildResponse, buildResponseMeta } from 'common/response';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { db } from 'src/db';
import { categories } from 'src/db/schema';
import { and, count, gte, ilike, lte, SQL, asc, eq } from 'drizzle-orm';

import { Filters, Paginations } from 'types/filter.type';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class CategoryService {
  async create(createCategoryDto: CreateCategoryDto) {
    const payload = {
      ...createCategoryDto,
      id: uuidv7(),
    };

    const [newCategories] = await db
      .insert(categories)
      .values(payload)
      .returning();

    return buildResponse('Categories created successfully', newCategories);
  }

  async findAll(filters: Filters, pagination: Paginations) {
    const { start_date, end_date, name } = filters;
    const { page = 1, per_page = 10 } = pagination;

    // Initialize where conditions
    const whereConditions: SQL[] = [];

    // Date filter
    if (start_date || end_date) {
      const dateConditions: SQL[] = [];

      if (start_date) {
        dateConditions.push(
          gte(categories.created_at, new Date(start_date).toISOString()),
        );
      }

      if (end_date) {
        dateConditions.push(
          lte(categories.created_at, new Date(end_date).toISOString()),
        );
      }
      whereConditions.push(and(...dateConditions));
    }

    // Name filter
    if (name) {
      whereConditions.push(ilike(categories.name, `%${name}%`));
    }
    // Build final where clause
    const where =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Execute query
    const [getCategories] = await db
      .select()
      .from(categories)
      .where(where)
      .orderBy(asc(categories.id))
      .limit(Number(per_page))
      .offset(Number((page - 1) * per_page));

    // Get total count (assuming you want total without filters)
    const totalResult = await db.select({ count: count() }).from(categories);

    const total = totalResult[0]?.count || 0;

    const meta = {
      total,
      page: Number(page),
      per_page: Number(per_page),
    };

    return buildResponseMeta('Categories found', getCategories, meta);
  }

  async findOne(id: string) {
    const [getCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    return buildResponse('Category found', getCategory);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const [updateCategories] = await db
      .update(categories)
      .set({
        ...updateCategoryDto,
      })
      .where(eq(categories.id, id))
      .returning();

    return buildResponse('Categories updated successfully', updateCategories);
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
