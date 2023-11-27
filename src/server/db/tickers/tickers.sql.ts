import {
  integer,
  sqliteTable,
  unique,
  text,
  index,
  primaryKey,
} from "drizzle-orm/sqlite-core";

import { timestamps, id } from "~/server/util/sql";
import { sql } from "drizzle-orm";

export const tickers = sqliteTable(
  "tickers",
  {
    ticker: text("ticker").primaryKey(),
    name: text("name").notNull(),
    // id: id,
    country: text("country").notNull(),
    sector: text("sector"),
    industry: text("industry"),
    type: text("type", {
      enum: ["stock", "crypto", "forex", "commodity"],
    }).notNull(),
    ipoDate: integer("ipo_date", { mode: "timestamp" }),
    exchange: text("exchange"),
    ...timestamps,
  },
  (table) => ({
    tickerExchangeIdx: unique("ticker_exchange_idx").on(
      table.ticker,
      table.exchange,
    ),
  }),
);
export type SelectTicker = typeof tickers.$inferSelect;
