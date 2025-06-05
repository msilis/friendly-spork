import { pgTable, jsonb, AnyPgColumn } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const familyTable = pgTable("family_table", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  family_last_name: t.varchar("family_last_name").notNull(),
  parent1_first_name: t.varchar("parent1_first_name").notNull(),
  parent1_last_name: t.varchar("parent1_last_name").notNull(),
  parent1_email: t.varchar("parent1_email").notNull(),
  parent1_mobile_phone: t.varchar("parent1_mobile_phone").notNull(),
  parent2_first_name: t.varchar("parent2_first_name"),
  parent2_last_name: t.varchar("parent2_last_name"),
  parent2_email: t.varchar("parent2_email"),
  parent2_mobile_phone: t.varchar("parent2_mobile_phone"),
  parent1_address: t.varchar("parent1_address"),
  parent2_address: t.varchar("parent2_address"),
  alternate_contact_name: t.varchar("alternate_contact_name"),
  alternate_contact_email: t.varchar("alternate_contact_email"),
  alternate_contact_mobile_phone: t.varchar("alternate_contact_mobile_phone"),
});

export const studentTable = pgTable("student_table", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  first_name: t.varchar("first_name"),
  last_name: t.varchar("last_name"),
  birthdate: t.varchar("birthdate"),
  family_id: t
    .integer("family_id")
    .references((): AnyPgColumn => familyTable.id),
  teacher_id: t
    .integer("teacher_id")
    .references((): AnyPgColumn => teacherTable.id),
});

export const teacherTable = pgTable("teacher_table", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  teacher_first_name: t.varchar("teacher_first_name"),
  teacher_last_name: t.varchar("teacher_last_name"),
  teacher_email: t.varchar("teacher_email"),
  teacher_mobile_phone: t.varchar("teacher_mobile_phone"),
  teacher_address: t.varchar("teacher_address"),
  is_teacher_accompanist: t.integer("is_teacher_accompanist"),
});

export const classesTable = pgTable("classes_table", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  class_name: t.varchar("class_name"),
  class_location: t.varchar("class_location"),
  class_start_time: t.varchar("class_start_time"),
  class_end_time: t.varchar("class_end_time"),
  class_accompanist: t
    .integer("class_accompanist")
    .references(() => teacherTable.id),
  class_students: jsonb("class_students"),
  class_teacher: jsonb("class_teacher"),
});

export const settingsTable = pgTable("settings_table", {
  settings_key: t.varchar("settings_key").primaryKey(),
  settings_value: t.varchar("settings_value"),
});

export const transactionTable = pgTable("transaction_table", {
  id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  account_id: t.integer("account_id").references(() => familyTable.id),
  transaction_date: t.varchar("transaction_date"),
  transaction_amount: t.integer("transaction_amount"),
  transaction_type: t.varchar("transaction_type").notNull(),
  transaction_description: t.varchar("transaction_description"),
});

export const invoiceTable = pgTable("invoice_table", {
  invoice_id: t.integer("invoice_id").primaryKey().generatedAlwaysAsIdentity(),
  invoice_number: t.integer("invoice_number"),
  account_id: t
    .integer("account_id")
    .notNull()
    .references(() => familyTable.id),
  invoice_date: t.varchar("invoice_date").notNull(),
  total_amount: t.integer("total_amount").notNull(),
  invoice_status: t.varchar("invoice_status").default("unpaid"), //unpaid, paid, overdue
});

export const invoiceItemTable = pgTable("invoice_item_table", {
  invoice_item_id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  invoice_number: t.integer("invoice_number"),
  invoice_id: t
    .integer("invoice_id")
    .notNull()
    .references(() => invoiceTable.invoice_id),
  item_type: t.varchar("item_type").notNull(), //charge, payment, refund, discount
  item_description: t.varchar("item_description"),
  item_amount: t.integer("item_amount").notNull(),
});

export const userTable = pgTable("user_table", {
  user_id: t.integer("user_id").primaryKey().generatedAlwaysAsIdentity(),
  email: t.varchar("email").notNull(),
  hashedPassword: t.varchar("hashedPassword").notNull(),
});
