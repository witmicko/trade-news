export * as News from "./";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { eq, inArray } from "drizzle-orm";

import { type z } from "zod";
import {
  news,
  topics,
  newsTypes,
  newsToTickers,
  newsToTopics,
} from "./news.sql";
import { tickers } from "../tickers/tickers.sql";
import { db } from "../../db";

// Schema for selecting a user - can be used to validate API responses
const Info = createSelectSchema(news);
export type Info = z.infer<typeof Info>;

// Overriding the fields
const insertTickerSchema = createInsertSchema(news);

interface NewsItemJson {
  news_url: string;
  image_url: string;
  title: string;
  text: string;
  source_name: string;
  date: string;
  topics: string[];
  sentiment: string;
  type: string;
  tickers: string[];
}

export const fromJson = (json: NewsItemJson): NewsOptions => {
  const news = insertTickerSchema.parse({
    url: json.news_url,
    imageUrl: json.image_url,
    title: json.title,
    text: json.text,
    sourceName: json.source_name,
    date: new Date(json.date),
    type: json.type,
    sentiment: json.sentiment,
  }) as Info;

  return {
    news,
    topics: json.topics,
    tickers: json.tickers,
  };
};
export interface NewsOptions {
  news: Info;
  topics: string[];
  tickers: string[];
}

// TODO: add notifications when new type topic and ticker is added
export const create = async (newsOptions: NewsOptions) => {
  const existingType = await db.query.newsTypes
    .findFirst({
      where: (t, { eq }) => eq(t.name, newsOptions.news.type),
    })
    .execute();
  if (!existingType) {
    await db
      .insert(newsTypes)
      .values({ name: newsOptions.news.type })
      .execute();
  }

  if (newsOptions.topics.length === 0) {
    newsOptions.topics.push("none");
  }

  if (newsOptions.tickers.length === 0) {
    console.log(`>>>>>`);
  }
  const existingTopics = await db.query.topics.findMany({
    where: inArray(topics.name, newsOptions.topics),
  });

  if (existingTopics.length !== newsOptions.topics.length) {
    const newTopics = newsOptions.topics.filter(
      (t) => !existingTopics.find((et) => et.name === t),
    );
    await db
      .insert(topics)
      .values(newTopics.map((t) => ({ name: t })))
      .execute();
  }

  const existingTickers = await db.query.tickers.findMany({
    where: inArray(tickers.ticker, newsOptions.tickers),
  });

  // TODO! handle if we get no ticker
  const instertedNews = (
    await db
      .insert(news)
      .values(newsOptions.news)
      .returning({ insertedId: news.id })
  )[0];
  console.log(`>>>>> ${JSON.stringify(instertedNews, null, 2)}`);
  if (!instertedNews) {
    throw new Error("Could not insert news");
  }

  for (const t of existingTopics) {
    await db
      .insert(newsToTopics)
      .values({ news: instertedNews.insertedId, topic: t.name })
      .execute();
  }

  for (const t of existingTickers) {
    await db
      .insert(newsToTickers)
      .values({ news: instertedNews.insertedId, ticker: t.id })
      .execute();
  }

  return instertedNews.insertedId;
};

export const getAll = async () => {
  const news = await db.query.news.findMany({
    with: {
      tickersToNews: {
        columns: {
          news: false,
        },
        with: {
          ticker: true,
        },
      },
      topicsToNews: {
        columns: {
          news: false,
        },
        with: {
          topic: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
  });
  if (!news) {
    return [];
  }
  return news.map((n) => {
    const { tickersToNews, topicsToNews, ...rest } = n;
    const tickers = n?.tickersToNews?.map((t) => t.ticker) || [];
    const topics = n?.topicsToNews?.map((t) => t?.topic?.name) || [];
    return { ...rest, tickers, topics };
  });
};

// TODO: fix any types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getById = async (id: number): Promise<any> => {
  const news = await db.query.news.findFirst({
    where: (t, { eq }) => eq(t.id, id),
    with: {
      tickersToNews: {
        columns: {
          news: false,
        },
        with: {
          ticker: true,
        },
      },
      topicsToNews: {
        columns: {
          news: false,
        },
        with: {
          topic: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
  });
  if (!news) {
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { tickersToNews, topicsToNews, ...rest } = news;
  const tickers = news?.tickersToNews?.map((t) => t.ticker) || [];
  const topics = news?.topicsToNews?.map((t) => t?.topic?.name) || [];

  return { ...rest, tickers, topics };
};

export const deleteAll = async () => {
  const tickersRm = await db.delete(newsToTickers);
  const topicsRm = await db.delete(newsToTopics);
  const newsRm = await db.delete(news);
  console.log(`>>>>>`);
};
