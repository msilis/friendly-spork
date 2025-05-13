import express from "express";
import router from "./routes/routes.mts";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import bodyParser from "body-parser";
import cors from "cors";
import { Database } from "@sqlitecloud/drivers";

dotenv.config();

const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbUserPassword = process.env.DB_PASSWORD;
const sslValue = process.env.SSL_VALUE;

const client = new Client({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbUserPassword,
  database: dbName,
  ssl: {
    rejectUnauthorized: sslValue === "true" ? true : false,
  },
});

console.log(sslValue, "sslVale from index");

// if (sslValue === "true") {
//   client.ssl = {
//     rejectUnauthorized: true,
//   };
// } else if (sslValue === "false") {
//   client.ssl = {
//     rejectUnauthorized: false,
//   };
// } else if (process.env.NODE_ENV === "production") {
//   client.ssl = {
//     rejectUnauthorized: true,
//   };
// }

export const app = express();
const port = process.env.BACKEND_PORT || 8080;

async function connectToDb() {
  try {
    await client.connect();
    console.log("Successfully connected to database");
  } catch (error) {
    console.error(
      "There was an error connecting to the database (from main connect): ",
      error,
    );
  }
}

connectToDb();

const dbFile = process.env.DB_FILE_NAME;

const db = drizzle(client);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:46349",
    ],
  }),
);
app.use(bodyParser.json());
app.use("/", router);
app.use(express.json());

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
