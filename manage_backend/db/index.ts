import { drizzle } from "drizzle-orm/libsql";
import "dotenv/config";
import { eq } from "drizzle-orm";
import { userTable } from "./dbSchema";
import sqlite from "sqlite3";

const db = drizzle(process.env.DB_FILE_NAME!);

async function main() {
  const user: typeof userTable.$inferInsert = {
    name: "John",
    age: 30,
    email: "example@email.com",
  };

  const user2: typeof userTable.$inferInsert = {
    name: "Jane",
    age: 30,
    email: "jane@email.com",
  };

  await db.insert(userTable).values(user);
  await db.insert(userTable).values(user2);
  console.log("New user created!");

  const users = await db.select().from(userTable);

  console.log("Getting all users from database: ", users);

  await db
    .update(userTable)
    .set({ age: 31 })
    .where(eq(userTable.email, user.email));
  console.log("User info updated");

  await db.delete(userTable).where(eq(userTable.email, user.email));
  console.log("User deleted");
}

main();
