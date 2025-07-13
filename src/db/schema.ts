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

import { sql } from 'drizzle-orm';
// src/database/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().notNull().unique(),
  name: text('name', { length: 100 }).notNull(),
  email: text('email', { length: 255 }).notNull(),
  password: text('password', { length: 255 }).notNull(),
  role: text('role', { enum: ['admin', 'user'] })
    .notNull()
    .default('user'),
  is_active: integer('is_active', { mode: 'boolean' }).default(true),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: text('updated_at')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  deleted_at: text('deleted_at'),
});

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey().notNull().unique(),
  name: text('name').notNull(),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: text('updated_at')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  deleted_at: text('deleted_at'),
});

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey().notNull().unique(),
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
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: text('updated_at')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  deleted_at: text('deleted_at'),
});
