import { sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  index,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type AdapterAccount } from "next-auth/adapters";

// export const users2 = sqliteTable('users', {
// 	id: integer('id').primaryKey(),
// 	name: text('name').notNull(),
// 	email: text('email').notNull(),
// 	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
// });

// export const insertUserSchema = createInsertSchema(users);
// export const selectUserSchema = createSelectSchema(users);

export const posts = sqliteTable(
  "post",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name", { length: 256 }),
    authorId: integer("author_id")
      .notNull()
      .references(() => users.id),
    createdAt: integer("created_at", { mode: "timestamp" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    updateAt: integer("updated_at", { mode: "timestamp" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (example) => ({
    authorIndex: index("createdById_idx").on(example.authorId),
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const users = sqliteTable("user", {
  id: text("id", { length: 255 }).notNull().primaryKey(),
  name: text("name", { length: 255 }),
  email: text("email", { length: 255 }).notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  image: text("image", { length: 255 }),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId").references(() => users.id),
    type: text("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: text("provider", { length: 255 }).notNull(),
    providerAccountId: text("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type", { length: 255 }),
    scope: text("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: text("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const sessions = sqliteTable(
  "session",
  {
    sessionToken: text("sessionToken", { length: 255 }).notNull().primaryKey(),
    userId: text("userId", { length: 255 }).notNull(),
    expires: integer("expires", { mode: "timestamp" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx2").on(session.userId),
  }),
);

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    token: text("token", { length: 255 }).notNull(),
    expires: integer("expires", { mode: "timestamp" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);
