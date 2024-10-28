import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./db/dbSchema.mts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});
