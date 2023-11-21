import { type Config } from "drizzle-kit";

import { env } from "~/env.mjs";

export default {
  schema: "./src/server/db/schema.ts",
  breakpoints: true,
  out: './drizzle',
  driver: 'turso',
  dbCredentials: {
    url: 'file:./drizzle/db.sqlite',
  }
  // dbCredentials: {
  //   connectionString: env.DATABASE_URL,
  // },
  // tablesFilter: ["news-ai-t3-drizzle_*"],
} satisfies Config;
