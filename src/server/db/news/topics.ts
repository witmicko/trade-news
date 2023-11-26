export * as Topics from "./topics";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type z } from "zod";
import { topics } from "./news.sql";
import { db } from "../../db";

const Info = createSelectSchema(topics);
export type Info = z.infer<typeof Info>;

const insertTickerSchema = createInsertSchema(topics);

export const create = async (name: string) => {
  const topic = insertTickerSchema.parse({
    name,
  }) as Info;
  return db.insert(topics).values(topic).execute();
};

export const getAll = async () => {
  return db.query.topics.findMany();
};

export const deleteAll = async () => {
  return db.delete(topics);
};

export const getTopic = async (topic: string) => {
  return await db.query.topics
    .findMany({
      where: (t, { eq }) => eq(t.name, topics),
    })
    .execute();
};
