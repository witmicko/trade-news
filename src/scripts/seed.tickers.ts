import { env } from "~/env.mjs";
import * as fs from "fs";
import * as R from "ramda";

import { tickers } from "~/server/db/tickers/tickers.sql";
import { Tickers, type TickerJson } from "~/server/db/tickers/";
import { db } from "~/server/db";

const main = async () => {
  console.log(process.cwd());
  await Tickers.deleteAll();

  const jsonFile = fs.readFileSync("./api_data/tickers-db.json", "utf8");

  const json = JSON.parse(jsonFile) as { data: TickerJson[] };

  const tickersInfo = json.data.map(Tickers.fromJson);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const chunks = R.splitEvery(100, tickersInfo);
  console.log(`>>>>>`);
  for (const chunk of chunks) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await db.insert(tickers).values(chunk).execute();
    console.log(`>>>>>`);
  }
};

main()
  .then(() => ({}))
  .catch(console.error);
