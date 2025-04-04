import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const familyTable = sqliteTable("family_table", {
  id: int("id").primaryKey({ autoIncrement: true }),
  family_last_name: text("family_last_name").notNull(),
  parent1_first_name: text("parent1_first_name").notNull(),
  parent1_last_name: text("parent1_last_name").notNull(),
  parent1_email: text("parent1_email").notNull(),
  parent1_mobile_phone: text("parent1_mobile_phone").notNull(),
  parent2_first_name: text("parent2_first_name"),
  parent2_last_name: text("parent2_last_name"),
  parent2_email: text("parent2_email"),
  parent2_mobile_phone: text("parent2_mobile_phone"),
  parent1_address: text("parent1_address"),
  parent2_address: text("parent2_address"),
  alternate_contact_name: text("alternate_contact_name"),
  alternate_contact_email: text("alternate_contact_email"),
  alternate_contact_mobile_phone: int("alternate_contact_mobile_phone"),
});

export const teacherTable = sqliteTable("teacher_table", {
  id: int("id").primaryKey({ autoIncrement: true }),
  teacher_first_name: text("teacher_first_name").notNull(),
  teacher_last_name: text("teacher_last_name").notNull(),
  teacher_email: text("teacher_email").notNull(),
  teacher_mobile_phone: text("teacher_mobile_phone"),
  teacher_address: text("teacher_address"),
  is_teacher_accompanist: int("is_teacher_accompanist"),
});

export const studentTable = sqliteTable("student_table", {
  id: int("id").primaryKey({ autoIncrement: true }),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  birthdate: text("birthdate"),
  family_id: int("family_id").references(() => familyTable.id),
  teacher_id: int("teacher_id").references(() => teacherTable.id),
});

export const classesTable = sqliteTable("classes_table", {
  id: int("id").primaryKey({ autoIncrement: true }),
  class_name: text("class_name").notNull(),
  class_location: text("class_location"),
  class_start_time: text("class_start_time"),
  class_end_time: text("class_end_time"),
  class_students: text("class_students", { mode: "json" }),
  class_teacher: text("class_teacher", { mode: "json" }),
  class_accompanist: int("class_accompanist").references(() => teacherTable.id),
});

export const settingsTable = sqliteTable("settings_table", {
  settings_key: text("settings_key").primaryKey().notNull(),
  settings_value: text("settings_value").notNull(),
});

export const familyAccountTable = sqliteTable("family_account_table", {
  id: int("id").primaryKey({ autoIncrement: true }),
  family_id: int("family_id").references(() => familyTable.id),
  account_status: text("account_status"),
});

export const transactionTable = sqliteTable("transaction_table", {
  id: int("id").primaryKey({ autoIncrement: true }),
  account_id: int("account_id").references(() => familyTable.id),
  transaction_date: text("transaction_date"),
  transaction_amount: int("transaction_amount"),
  transaction_type: int("transaction_type"),
  transaction_description: text("transaction_description"),
});

export const invoiceTable = sqliteTable("invoice_table", {
  invoice_id: int("invoice_id").primaryKey({ autoIncrement: true }),
  invoice_number: int("invoice_number"),
  account_id: int("account_id")
    .notNull()
    .references(() => familyTable.id),
  invoice_date: text("invoice_date").notNull(),
  total_amount: int("total_amount").notNull(),
  invoice_status: text("invoice_status").default("unpaid"), //unpaid, paid, overdue
});

export const invoiceItemTable = sqliteTable("invoice_item_table", {
  invoice_item_id: int("id").primaryKey({ autoIncrement: true }),
  invoice_number: int("invoice_number"),
  invoice_id: int("invoice_id")
    .notNull()
    .references(() => invoiceTable.invoice_id),
  item_type: text("item_type").notNull(), //charge, payment, refund, discount
  item_description: text("item_description"),
  item_amount: int("item_amount").notNull(),
});

export const userTable = sqliteTable("user_table", {
  user_id: int("user_id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull(),
  hashedPassword: text("hashedPassword").notNull(),
});
