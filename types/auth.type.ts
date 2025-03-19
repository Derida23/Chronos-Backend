import { users } from 'src/db/schema';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type Auth = InferSelectModel<typeof users>;
export type UpdateAuth = InferInsertModel<typeof users>;
