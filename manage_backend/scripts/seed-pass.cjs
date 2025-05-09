const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const { userTable } = require("../db/seedPassSchema.cjs");
const dotenv = require("dotenv");

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbUserPassword = process.env.DB_PASSWORD;
const dbConnectionUrl = process.env.DB_URL;

const dbConfig = {
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbUserPassword,
  database: dbName,
  connectionString: dbConnectionUrl,
};

async function seedUsers() {
  if (!client.connectionString) throw new Error("No connection string!");
  const pool = new Pool(dbConfig);
  const client = await pool.connect();
  const db = drizzle(client);
  const usersToCreate = [
    { email: "testemail@email.com", password: "testPassword123" },
  ];

  const saltRounds = 10;

  for (const user of usersToCreate) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      await db
        .insert(userTable)
        .values({ email: user.email, hashedPassword: hashedPassword });
      console.log(`User record for ${user.email} has been created`);
    } catch (error) {
      console.log("Error; ", error);
    } finally {
      client.release();
      await pool.end();
    }
    console.log("Database seeding is complete");
    process.exit(0);
  }
}

seedUsers().catch((e) => {
  console.error(e);
  process.exit(1);
});
