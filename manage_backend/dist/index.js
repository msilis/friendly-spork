"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const libsql_1 = require("drizzle-orm/libsql");
require("dotenv/config");
const drizzle_orm_1 = require("drizzle-orm");
const dbSchema_1 = require("./dbSchema");
const db = (0, libsql_1.drizzle)(process.env.DB_FILE_NAME);
async function main() {
    const user = {
        name: "John",
        age: 30,
        email: "example@email.com",
    };
    const user2 = {
        name: "Jane",
        age: 30,
        email: "jane@email.com",
    };
    await db.insert(dbSchema_1.userTable).values(user);
    await db.insert(dbSchema_1.userTable).values(user2);
    console.log("New user created!");
    const users = await db.select().from(dbSchema_1.userTable);
    console.log("Getting all users from database: ", users);
    await db
        .update(dbSchema_1.userTable)
        .set({ age: 31 })
        .where((0, drizzle_orm_1.eq)(dbSchema_1.userTable.email, user.email));
    console.log("User info updated");
    await db.delete(dbSchema_1.userTable).where((0, drizzle_orm_1.eq)(dbSchema_1.userTable.email, user.email));
    console.log("User deleted");
}
main();
