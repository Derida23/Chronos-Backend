// import { drizzle } from 'drizzle-orm/libsql';
// import { createClient } from '@libsql/client';
// import { ConfigService } from '@nestjs/config';
// import * as schema from './schema';

// export const databaseProvider = {
//   provide: 'DB',
//   useFactory: (config: ConfigService) => {
//     const client = createClient({
//       url: config.get('DATABASE_URL'),
//       authToken: config.get('DATABASE_AUTH_TOKEN'),
//     });
//     return drizzle(client, { schema });
//   },
//   inject: [ConfigService],
// };

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';

config({ path: '.env' }); // or .env.local

export const db = drizzle({
  connection: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
