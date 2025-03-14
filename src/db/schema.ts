export enum TaskStatus {
  Pending = 1,
  InProgress = 2,
  Completed = 3,
}

export enum TaskLabel {
  Low = 1,
  Medium = 2,
  High = 3,
}

// src/database/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: text('user_id').unique().notNull(),
  name: text('name', { length: 100 }).notNull(),
  email: text('email', { length: 255 }).unique().notNull(),
  password: text('password', { length: 255 }).notNull(),
  role: text('role', { enum: ['admin', 'user'] })
    .notNull()
    .default('user'),
  is_active: integer('is_active', { mode: 'boolean' }).default(true),
  created_at: integer('created_at', { mode: 'timestamp' }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updated_at: integer('updated_at', { mode: 'timestamp' }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  deleted_at: integer('deleted_at', { mode: 'timestamp' }).default(null),
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  category_id: text('category_id').unique().notNull(),
  name: text('name').unique().notNull(),
});

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  task_id: text('task_id').unique().notNull(),
  title: text('title').notNull(),
  description: text('description'),
  user_id: integer('user_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  category_id: integer('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
  status: integer('status').$type<1 | 2 | 3>().notNull().default(1),
  label: integer('label').$type<1 | 2 | 3>().notNull().default(2),
  due_date: integer('due_date', { mode: 'timestamp' }).default(null),
  created_at: integer('created_at', { mode: 'timestamp' }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updated_at: integer('updated_at', { mode: 'timestamp' }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  deleted_at: integer('deleted_at', { mode: 'timestamp' }).default(null),
});
