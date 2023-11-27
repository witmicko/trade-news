export * as Tickers from "./";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type z } from "zod";
import { tickers } from "./tickers.sql";
import { db } from "../../db";
import { isValid } from "date-fns";
// Schema for selecting a user - can be used to validate API responses
const Info = createSelectSchema(tickers);
export type Info = z.infer<typeof Info>;

// Overriding the fields
const insertTickerSchema = createInsertSchema(tickers);

export interface TickerJson {
  ticker: string;
  name: string;
  country: string;
  has_news: string;
  industry?: string;
  sector?: string;
  ipo_date?: string;
  exchange?: string;
}

export const fromJson = (json: TickerJson) => {
  const ipoDate = new Date(json.ipo_date!);
  const { has_news, ipo_date, ...rest } = json;

  try {
    const ticker = {
      ...rest,
      ipoDate: isValid(ipoDate) ? ipoDate : new Date("1970-01-01"),
      type: "stock",
    };
    return insertTickerSchema.parse(ticker) as Info;
  } catch (e) {
    console.log(json);
    throw e;
  }
};

export const create = async (ticker: Info) => {
  return db.insert(tickers).values(ticker).execute();
};

export const getAll = async () => {
  return db.query.tickers.findMany();
};

export const deleteAll = async () => {
  return db.delete(tickers);
};

export const getTicker = async (ticker: string) => {
  return db.query.tickers
    .findMany({
      where: (t, { eq }) => eq(t.ticker, ticker),
    })
    .execute();
};
