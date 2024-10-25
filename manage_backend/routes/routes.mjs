import express from "express";

const router = express.Router();

// localhost:3000/
// localhost:3000/login
// localhost:3000/dashboard

router.get("/", (req, res) => {
  res.status(200).send("You are at the right place");
});

router.get("/login", (req, res) => {});

export default router;
