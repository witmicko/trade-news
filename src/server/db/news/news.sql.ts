import {
  integer,
  sqliteTable,
  unique,
  text,
  index,
  primaryKey,
} from "drizzle-orm/sqlite-core";

import { timestamps, id } from "~/server/util/sql";
import { sql, relations } from "drizzle-orm";
import { tickers } from "../tickers/tickers.sql";

export const topics = sqliteTable("topics", {
  ...timestamps,
  name: text("name").primaryKey(),
});

export const newsTypes = sqliteTable("newsTypes", {
  ...timestamps,
  name: text("name").primaryKey(),
});

export const news = sqliteTable("news", {
  ...timestamps,
  id: id,
  url: text("url").notNull(),
  imageUrl: text("imageUrl").notNull(),
  title: text("title").notNull(),
  text: text("text").notNull(),
  sourceame: text("sourceName").notNull(),
  date: integer("date", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  sentiment: text("sentiment").notNull(),
  type: text("type")
    .references(() => newsTypes.name)
    .notNull(),
  // topics: text("topics")
  //   .references(() => topics.name)
  //   .notNull(),
  // tickers: text("tickers")
  //   .references(() => tickers.ticker)
  //   .notNull(),
});

export const newsToTickers = sqliteTable(
  "newsToTickers",
  {
    news: integer("news").references(() => news.id),
    ticker: integer("ticker").references(() => tickers.ticker),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.ticker, table.news] }),
  }),
);

export const newsToTopics = sqliteTable(
  "newsToTopics",
  {
    news: integer("news").references(() => news.id),
    topic: text("topic").references(() => topics.name),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.topic, table.news] }),
  }),
);

// RELATIONS
// export const topicsRelations = relations(topics, ({ many }) => ({
//   news: many(newsToTopics),
// }));

// export const newsTypesRelations = relations(newsTypes, ({ many }) => ({
//   news: many(news),
// }));

// export const newsToTickersRelations = relations(
//   newsToTickers,
//   ({ one, many }) => ({
//     news: one(news, {
//       fields: [newsToTickers.news],
//       references: [news.id],
//     }),
//     ticker: one(tickers, {
//       fields: [newsToTickers.ticker],
//       references: [tickers.id],
//     }),
//   }),
// );

// export const newsToTopicsRelations = relations(
//   newsToTopics,
//   ({ one, many }) => ({
//     news: one(news, {
//       fields: [newsToTopics.news],
//       references: [news.id],
//     }),
//     topic: one(topics, {
//       fields: [newsToTopics.topic],
//       references: [topics.name],
//     }),
//   }),
// );
// export const tickersRelations = relations(tickers, ({ many }) => ({
//   news: many(news),
// }));

// export const newsRelations = relations(news, ({ many }) => ({
//   tickersToNews: many(newsToTickers),
//   topicsToNews: many(newsToTopics),
// }));
