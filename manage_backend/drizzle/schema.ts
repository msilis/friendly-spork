import {
  sqliteTable,
  AnySQLiteColumn,
  integer,
  text,
  foreignKey,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const familyTable = sqliteTable("family_table", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  familyLastName: text("family_last_name").notNull(),
  parent1FirstName: text("parent1_first_name").notNull(),
  parent1LastName: text("parent1_last_name").notNull(),
  parent1Email: text("parent1_email").notNull(),
  parent1MobilePhone: integer("parent1_mobile_phone").notNull(),
  parent2FirstName: text("parent2_first_name"),
  parent2LastName: text("parent2_last_name"),
  parent2Email: text("parent2_email"),
  parent2MobilePhone: integer("parent2_mobile_phone"),
  parent1Address: text("parent1_address"),
  parent2Address: text("parent2_address"),
  alternateContactName: text("alternate_contact_name"),
  alternateContactEmail: text("alternate_contact_email"),
  alternateContactMobilePhone: integer("alternate_contact_mobile_phone"),
});

export const studentTable = sqliteTable("student_table", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  birthdate: text(),
  familyId: integer("family_id").references(() => familyTable.id),
  teacherId: integer("teacher_id").references(() => teacherTable.id),
});

export const teacherTable = sqliteTable("teacher_table", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  teacherFirstName: text("teacher_first_name").notNull(),
  teacherLastName: text("teacher_last_name").notNull(),
  teacherEmail: text("teacher_email").notNull(),
  teacherMobilePhone: integer("teacher_mobile_phone"),
  teacherAddress: text("teacher_address"),
  isTeacherAccompanist: integer("is_teacher_accompanist"),
});

export const classesTable = sqliteTable("classes_table", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  className: text("class_name").notNull(),
  classLocation: text("class_location"),
  classStartTime: text("class_start_time"),
  classEndTime: text("class_end_time"),
  classStudents: text("class_students"),
  classTeacher: text("class_teacher"),
  classAccompanist: integer("class_accompanist"),
});

export const drizzleMigrations = sqliteTable("__drizzle_migrations", {});
