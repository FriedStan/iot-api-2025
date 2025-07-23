import * as t from "drizzle-orm/pg-core";

export const students = t.pgTable("students", {
  studentId: t.varchar({ length: 50 }).primaryKey(),
  name: t.varchar({ length: 255 }).notNull(),
  surname: t.varchar({ length: 255 }).notNull(),
  dateOfBirth: t.date().notNull(),
  gender: t.varchar({ length: 50 }).notNull(),
});
