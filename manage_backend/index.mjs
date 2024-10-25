import express from "express";
import router from "./routes/routes.mjs";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/", router);

app.listen(3000, () => {
  console.log("listening on 3000");
});
