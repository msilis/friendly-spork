import express from "express";
import router from "./routes/routes.mjs";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/libsql";

dotenv.config();

const app = express();
const port = process.env.BACKEND_PORT || 8080;
const db = drizzle(process.env.DB_FILE_NAME);

app.use("/", router);
app.use(express.json());

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
