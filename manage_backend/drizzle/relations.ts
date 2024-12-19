import { relations } from "drizzle-orm/relations";
import { teacherTable, studentTable, familyTable } from "./schema";

export const studentTableRelations = relations(studentTable, ({one}) => ({
	teacherTable: one(teacherTable, {
		fields: [studentTable.teacherId],
		references: [teacherTable.id]
	}),
	familyTable: one(familyTable, {
		fields: [studentTable.familyId],
		references: [familyTable.id]
	}),
}));

export const teacherTableRelations = relations(teacherTable, ({many}) => ({
	studentTables: many(studentTable),
}));

export const familyTableRelations = relations(familyTable, ({many}) => ({
	studentTables: many(studentTable),
}));