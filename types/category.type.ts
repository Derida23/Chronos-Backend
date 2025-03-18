import { categories } from 'src/db/schema';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type Category = InferSelectModel<typeof categories>;
export type UpdateCategory = InferInsertModel<typeof categories>;
