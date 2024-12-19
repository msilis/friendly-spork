"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentTable = exports.teacherTable = exports.familyTable = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.familyTable = (0, sqlite_core_1.sqliteTable)("family_table", {
  id: (0, sqlite_core_1.int)("id").primaryKey({ autoIncrement: true }),
  family_last_name: (0, sqlite_core_1.text)("family_last_name").notNull(),
  parent1_first_name: (0, sqlite_core_1.text)("parent1_first_name").notNull(),
  parent1_last_name: (0, sqlite_core_1.text)("parent1_last_name").notNull(),
  parent1_email: (0, sqlite_core_1.text)("parent1_email").notNull(),
  parent1_mobile_phone: (0, sqlite_core_1.int)(
    "parent1_mobile_phone",
  ).notNull(),
  parent2_first_name: (0, sqlite_core_1.text)("parent2_first_name"),
  parent2_last_name: (0, sqlite_core_1.text)("parent2_last_name"),
  parent2_email: (0, sqlite_core_1.text)("parent2_email"),
  parent2_mobile_phone: (0, sqlite_core_1.int)("parent2_mobile_phone"),
  parent1_address: (0, sqlite_core_1.text)("parent1_address"),
  parent2_address: (0, sqlite_core_1.text)("parent2_address"),
  alternate_contact_name: (0, sqlite_core_1.text)("alternate_contact_name"),
  alternate_contact_email: (0, sqlite_core_1.text)("alternate_contact_email"),
  alternate_contact_mobile_phone: (0, sqlite_core_1.int)(
    "alternate_contact_mobile_phone",
  ),
});
exports.teacherTable = (0, sqlite_core_1.sqliteTable)("teacher_table", {
  id: (0, sqlite_core_1.int)("id").primaryKey({ autoIncrement: true }),
  teacher_first_name: (0, sqlite_core_1.text)("teacher_first_name").notNull(),
  teacher_last_name: (0, sqlite_core_1.text)("teacher_last_name").notNull(),
  teacher_email: (0, sqlite_core_1.text)("teacher_email").notNull(),
  teacher_mobile_phone: (0, sqlite_core_1.int)("teacher_mobile_phone"),
});
exports.studentTable = (0, sqlite_core_1.sqliteTable)("student_table", {
  id: (0, sqlite_core_1.int)("id").primaryKey({ autoIncrement: true }),
  first_name: (0, sqlite_core_1.text)("first_name").notNull(),
  last_name: (0, sqlite_core_1.text)("last_name").notNull(),
  birthdate: (0, sqlite_core_1.text)("birthdate"),
  family_id: (0, sqlite_core_1.int)("family_id").references(
    () => exports.familyTable.id,
  ),
  teacher_id: (0, sqlite_core_1.int)("teacher_id").references(
    () => exports.teacherTable.id,
  ),
});
