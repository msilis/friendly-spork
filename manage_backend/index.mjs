import express from "express";
import router from "./routes/routes.mts";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

export const app = express();
const port = process.env.BACKEND_PORT || 8080;
const db = drizzle(process.env.DB_FILE_NAME);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
  }),
);
app.use(bodyParser.json());
app.use("/", router);
app.use(express.json());

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
