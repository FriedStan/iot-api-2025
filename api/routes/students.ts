import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { students } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import dayjs from "dayjs";

const studentsRouter = new Hono();

studentsRouter.get("/", async (c) => {
  const allBooks = await drizzle.select().from(students);
  return c.json(allBooks);
});

studentsRouter.get("/:id", async (c) => {
  const id = String(c.req.param("id"));
  const result = await drizzle.query.students.findFirst({
    where: eq(students.studentId, id),
    with: {
      genre: true,
    },
  });
  if (!result) {
    return c.json({ error: "Student not found" }, 404);
  }
  return c.json(result);
});

studentsRouter.post(
  "/",
  zValidator(
    "json",
    z.object({
      studentId: z.string().min(1),
      name: z.string().min(1),
      surname: z.string().min(1),
      dateOfBirth: z.iso.date(),
      gender: z.string().min(1),
    })
  ),
  async (c) => {
    const { studentId, name, surname, dateOfBirth, gender } = c.req.valid("json");
    const result = await drizzle
      .insert(students)
      .values({
        studentId,
        name,
        surname,
        dateOfBirth,
        gender
      })
      .returning();
    return c.json({ success: true, Student: result[0] }, 201);
  }
);

studentsRouter.patch(
  "/:id",
  zValidator(
    "json",
    z.object({
      studentId: z.string().optional(),
      name: z.string().optional(),
      surname: z.string().optional(),
      dateOfBirth: z.iso.date().optional(),
      gender: z.string().optional(),
    })
  ),
  async (c) => {
    const id = String(c.req.param("id"));
    const data = c.req.valid("json");
    const updated = await drizzle.update(students).set(data).where(eq(students.studentId, id)).returning();
    if (updated.length === 0) {
      return c.json({ error: "Student not found" }, 404);
    }
    return c.json({ success: true, Student: updated[0] });
  }
);

studentsRouter.delete("/:id", async (c) => {
  const id = String(c.req.param("id"));
  const deleted = await drizzle.delete(students).where(eq(students.studentId, id)).returning();
  if (deleted.length === 0) {
    return c.json({ error: "Student not found" }, 404);
  }
  return c.json({ success: true, Student: deleted[0] });
});

export default studentsRouter;
