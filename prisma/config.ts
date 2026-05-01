import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env') });

export default defineConfig({
  schema: 'schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL_UNPOOLED!,
  },
});
