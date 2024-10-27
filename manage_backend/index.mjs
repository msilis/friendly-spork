import express from "express";
import router from "./routes/routes.mjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.BACKEND_PORT || 8080;

app.use("/", router);
app.use(express.json());

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
