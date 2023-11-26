import {
  integer,
  sqliteTable,
  unique,
  text,
  index,
  primaryKey,
} from "drizzle-orm/sqlite-core";

import { sql } from "drizzle-orm";

// export const cuid = (name: string) => char(name, { length: 24 });
// export const id = {
//   get id() {
//     return cuid("id").primaryKey().notNull();
//   },
// };

// export const workspaceID = {
//   get id() {
//     return cuid("id").notNull();
//   },
//   get workspaceID() {
//     return cuid("workspace_id").notNull();
//   },
// };

export const id = integer("id", { mode: "number" }).primaryKey({
  autoIncrement: true,
});

export const timestamps = {
  createdAti: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updateAti: integer("updated_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  deletedAti: integer("deleted_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updateAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
};
