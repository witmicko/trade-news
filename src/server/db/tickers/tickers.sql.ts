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
    ...timestamps,
    id: id,
    type: text("type", {
      enum: ["stock", "crypto", "forex", "commodity"],
    }).notNull(),
    country: text("country").notNull(),
    industry: text("industry"),
    sector: text("sector"),
    ipoDate: integer("ipo_date", { mode: "timestamp" }),
    ticker: text("ticker").notNull(),
    exchange: text("exchange"),
    name: text("name").notNull(),
  },
  (table) => ({
    tickerExchangeIdx: unique("ticker_exchange_idx").on(
      table.ticker,
      table.exchange,
    ),
  }),
);
export type SelectTicker = typeof tickers.$inferSelect;
