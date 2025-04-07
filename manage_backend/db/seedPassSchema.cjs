const { int, sqliteTable, text } = require("drizzle-orm/sqlite-core");

module.exports.userTable = sqliteTable("user_table", {
  user_id: int("user_id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  hashedPassword: text("hashedPassword").notNull(),
});
