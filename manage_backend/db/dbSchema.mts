import { int, sqliteTable, text, blob } from "drizzle-orm/sqlite-core";

export const familyTable = sqliteTable("family_table", {
  id: int("id").primaryKey({ autoIncrement: true }),
  family_last_name: text("family_last_name").notNull(),
  parent1_first_name: text("parent1_first_name").notNull(),
  parent1_last_name: text("parent1_last_name").notNull(),
  parent1_email: text("parent1_email").notNull(),
  parent1_mobile_phone: int("parent1_mobile_phone").notNull(),
  parent2_first_name: text("parent2_first_name"),
  parent2_last_name: text("parent2_last_name"),
  parent2_email: text("parent2_email"),
  parent2_mobile_phone: int("parent2_mobile_phone"),
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
  teacher_mobile_phone: int("teacher_mobile_phone"),
  teacher_address: text("teacher_address"),
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
  class_students: blob("class_students", { mode: "json" }),
  class_teacher: text("class_teacher"),
  class_accompanist: text("class_accompanist"),
});
