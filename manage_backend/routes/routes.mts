import express, { Request, Response } from "express";
import { drizzle } from "drizzle-orm/libsql";
import { sql } from "drizzle-orm";
import "dotenv/config";
import { eq } from "drizzle-orm";
import {
  studentTable,
  familyTable,
  teacherTable,
  classesTable,
  settingsTable,
} from "../db/dbSchema.mts";

const router = express.Router();
const dbFile = process.env.DB_FILE_NAME;
if (!dbFile) {
  throw new Error("Missing env for database file");
}

const db = drizzle(dbFile);

router.get("/", (req, res) => {
  res.status(200).send("You are at the right place");
});

//Authentication/Authorisation

router.post("/login", (req, res) => {});

router.get("/logout", (req, res) => {});

router.post("/signup", (req, res) => {});

//Student Management

router.post("/students/add", async (req: Request, res: Response) => {
  const parsedBody = await req.body;

  if (
    !parsedBody.first_name ||
    !parsedBody.last_name ||
    !parsedBody.birthdate
  ) {
    res.status(400).json({ error: "Missing fields" });
  }

  const studentToAdd: typeof studentTable.$inferInsert = {
    first_name: parsedBody.first_name,
    last_name: parsedBody.last_name,
    birthdate: parsedBody.birthdate,
    family_id: parsedBody.family_id,
    teacher_id: parsedBody.teacher_id,
  };

  try {
    await db.insert(studentTable).values(studentToAdd);
    res.status(200).json({ message: "Student added successfully!" });
  } catch (error) {
    console.error("There was an error creating the student record", error);
    res
      .status(500)
      .json({ message: "There was an error creating the student record" });
  }
});

router
  .route("/students/:studentId/edit")
  .get(async (req, res) => {
    const studentId = req.params.studentId;
    try {
      const studentData = await db
        .select()
        .from(studentTable)
        .where(eq(studentTable.id, Number(studentId)));
      res.status(200).json(studentData);
    } catch (error) {
      console.error(
        "There wan an error retreiving the student record: ",
        error,
      );
    }
  })
  .post(async (req, res) => {
    const studentId = req.params.studentId;
    const updatedStudentData = req.body;
    try {
      const studentExists = await db
        .select()
        .from(studentTable)
        .where(eq(studentTable.id, Number(studentId)));
      if (studentExists.length === 0) {
        res.status(404).json({ message: "Student not found" });
      } else {
        const filteredStudentData = Object.fromEntries(
          Object.entries(updatedStudentData).filter(
            (_, value) => value !== undefined,
          ),
        );
        const updatedData = await db
          .update(studentTable)
          .set(filteredStudentData)
          .where(eq(studentTable.id, Number(studentId)));

        // res.status(200).json(updatedData);
      }
    } catch (error) {
      console.error("There was an error updating the student record: ", error);
      res.status(500).json({ message: "Error updating the student" });
    }

    res.status(200).json({ message: "Student data updated successfully!" });
  });

router.delete("/students/:studentId/delete", async (req, res) => {
  const studentId = req.params.studentId;
  console.log(studentId, "studentId from params in routes");
  try {
    const studentExists = await db
      .select()
      .from(studentTable)
      .where(eq(studentTable.id, Number(studentId)));
    if (studentExists.length === 0) {
      res.status(404).json({ message: "Student not found" });
    } else {
      await db
        .delete(studentTable)
        .where(eq(studentTable.id, Number(studentId)));
      res.status(200).json({ message: "Record deleted successfully!" });
    }
  } catch (error) {
    console.error("There was an error deleting the record: ", error);
  }
});

router.get("/students", async (req, res) => {
  try {
    const allStudents = await db.select().from(studentTable);
    res.status(200).json(allStudents);
  } catch (error) {
    console.error("There was an error retreiving the student record: ", error);
    res.status(500).json({ message: "Error retreiving record" });
  }
});

//Family Management

router.post("/families/add", async (req, res) => {
  const {
    family_last_name,
    parent1_first_name,
    parent1_last_name,
    parent1_email,
    parent1_mobile_phone,
    parent2_first_name,
    parent2_last_name,
    parent2_email,
    parent2_mobile_phone,
    parent1_address,
    parent2_address,
    alternate_contact_name,
    alternate_contact_email,
    alternate_contact_mobile_phone,
  } = req.body;

  if (!family_last_name || !parent1_first_name || !parent1_last_name) {
    res.status(400).json({ error: "Missing fields" });
  }
  try {
    const familyToAdd = {
      family_last_name,
      parent1_first_name,
      parent1_last_name,
      parent1_email,
      parent1_mobile_phone,
      parent2_first_name,
      parent2_last_name,
      parent2_email,
      parent2_mobile_phone,
      parent1_address,
      parent2_address,
      alternate_contact_name,
      alternate_contact_email,
      alternate_contact_mobile_phone,
    };
    await db.insert(familyTable).values(familyToAdd);
    res.status(200).json({ message: "Family added successfully!" });
  } catch (error) {
    console.error("THere was an error creating the family record", error);
    res
      .status(500)
      .json({ message: "There was an error creating the family record" });
  }
});

router.get("/families/:family", async (req, res) => {
  const familyLastName = req.params.family;
  try {
    const familyData = await db
      .select()
      .from(familyTable)
      .where(sql`LOWER(${familyTable.family_last_name}) = ${familyLastName}`);
    res.status(200).json(familyData);
  } catch (error) {
    console.error("There was an error retreiving the family record", error);
  }
});

router
  .route("/families/:familyId/edit")
  .get(async (req, res) => {
    const familyId = req.params.familyId;
    try {
      const familyData = await db
        .select()
        .from(familyTable)
        .where(eq(familyTable.id, Number(familyId)));
      res.status(200).json(familyData);
    } catch (error) {
      console.error("There was an error retreiving the family record", error);
    }
  })
  .post(async (req, res) => {
    const familyId = req.params.familyId;
    const updatedFamilyData = req.body;
    try {
      const familyExists = await db
        .select()
        .from(familyTable)
        .where(eq(familyTable.id, Number(familyId)));
      if (familyExists.length === 0) {
        res.status(500).json({ message: "Family not found" });
      } else {
        const filteredFamilyData = Object.fromEntries(
          Object.entries(updatedFamilyData).filter(
            (_, value) => value !== undefined,
          ),
        );
        await db
          .update(familyTable)
          .set(filteredFamilyData)
          .where(eq(familyTable.id, Number(familyId)));
        res.status(200).json(filteredFamilyData);
      }
    } catch (error) {
      console.error("There was an error updating the record: ", error);
      res
        .status(500)
        .json({ message: "There was an error updating the record" });
    }
  });

router.delete("/families/:familyId/delete", async (req, res) => {
  const familyId = req.params.familyId;
  try {
    const familyExists = await db
      .select()
      .from(familyTable)
      .where(eq(familyTable.id, Number(familyId)));
    if (familyExists.length === 0) {
      res.status(500).json({ message: "Family not found" });
    } else {
      await db.delete(familyTable).where(eq(familyTable.id, Number(familyId)));
      res.status(200).json({ message: "Record deleted successfully!" });
    }
  } catch (error) {
    console.error("There was an error deleting the record: ", error);
  }
});

router.get("/families", async (req, res) => {
  try {
    const allFamilies = await db.select().from(familyTable);
    res.status(200).json(allFamilies);
  } catch (error) {
    console.error("There was an error geting the family record: ", error);
    res.status(500).json("There was an error getting the family record");
  }
});

//Teacher Management

router.post("/teachers/add", async (req, res) => {
  const {
    teacher_first_name,
    teacher_last_name,
    teacher_email,
    teacher_mobile_phone,
    teacher_address,
    is_teacher_accompanist,
  } = req.body;
  try {
    const teacherToAdd = {
      teacher_first_name,
      teacher_last_name,
      teacher_email,
      teacher_mobile_phone,
      teacher_address,
      is_teacher_accompanist,
    };
    await db.insert(teacherTable).values(teacherToAdd);
    res.status(200).json({ message: "Teacher added successfully!" });
  } catch (error) {
    console.error("There was an error creating the teacher record", error);
  }
});

router
  .route("/teachers/:teacherId/edit")
  .get(async (req, res) => {
    const teacherId = req.params.teacherId;
    try {
      const teacherExists = await db
        .select()
        .from(teacherTable)
        .where(eq(teacherTable.id, Number(teacherId)));
      if (teacherExists.length === 0) {
        res.status(500).json({ message: "Teacher record not found" });
      } else {
        const teacherData = await db
          .select()
          .from(teacherTable)
          .where(eq(teacherTable.id, Number(teacherId)));
        res.status(200).json(teacherData);
      }
    } catch (error) {
      console.error("There was an error retreiving the record: ", error);
      res
        .status(500)
        .json({ message: "There was an error retreiving the record" });
    }
  })
  .post(async (req, res) => {
    const teacherId = req.params.teacherId;
    const updatedTeacherData = req.body;
    try {
      const teacherExists = await db
        .select()
        .from(teacherTable)
        .where(eq(teacherTable.id, Number(teacherId)));
      if (teacherExists.length === 0) {
        res.status(500).json({ message: "Teache record not found" });
      } else {
        const filteredTeacherData = Object.fromEntries(
          Object.entries(updatedTeacherData).filter(
            (_, value) => value !== undefined,
          ),
        );
        await db
          .update(teacherTable)
          .set(filteredTeacherData)
          .where(eq(teacherTable.id, Number(teacherId)));

        res.status(200).json(filteredTeacherData);
      }
    } catch (error) {
      console.error("There was an error updating the teacher record: ", error);
      res
        .status(500)
        .json({ message: "There was an error updating the teacher record" });
    }
  });

router.delete("/teachers/:teacherId/delete", async (req, res) => {
  const teacherId = req.params.teacherId;
  try {
    const teacherExists = await db
      .select()
      .from(teacherTable)
      .where(eq(teacherTable.id, Number(teacherId)));
    if (teacherExists.length === 0) {
      res.status(500).json({ message: "Teache record not found" });
    } else {
      await db
        .delete(teacherTable)
        .where(eq(teacherTable.id, Number(teacherId)));
      res.status(200).json({ message: "Teacher deleted successfully!" });
    }
  } catch (error) {
    console.error("There was an error deleting the record: ", error);
  }
});

router.get("/teachers", async (req, res) => {
  try {
    const allTeachers = await db.select().from(teacherTable);
    res.status(200).json(allTeachers);
  } catch (error) {
    console.error("There was an error getting the teacher record: ", error);
    res
      .status(500)
      .json({ message: "There was an error getting the teacher record" });
  }
});

router.get("/accompanists", async (req, res) => {
  try {
    const accompanists = await db
      .select()
      .from(teacherTable)
      .where(eq(teacherTable.is_teacher_accompanist, "1.0"));
    res.status(200).json(accompanists);
  } catch (error) {
    console.error(error, "There was an error getting the list of accompanists");
    res
      .status(500)
      .json({ message: "There was an error getting the list of accompanists" });
  }
});

//Class Management

router.get("/classes", async (req, res) => {
  try {
    const allClasses = await db.select().from(classesTable);
    res.status(200).json(allClasses);
  } catch (error) {
    console.error("There was an error getting the classes record: ", error);
    res
      .status(500)
      .json({ message: "There was an error getting the classes record" });
  }
});

router.post("/classes/add", async (req, res) => {
  const {
    class_name,
    class_location,
    class_start_time,
    class_end_time,
    class_students,
    class_teacher,
    class_accompanist,
  } = req.body;

  try {
    const classToAdd = {
      class_name,
      class_location,
      class_start_time,
      class_end_time,
      class_students,
      class_teacher,
      class_accompanist,
    };
    await db.insert(classesTable).values(classToAdd);
    res.status(200).json({ message: "Class added successfully!" });
  } catch (error) {
    console.error(error, "There was an error adding class");
  }
});

router
  .route("/classes/:classId/edit")
  .get(async (req, res) => {
    const classId = req.params.classId;
    try {
      const classExists = await db
        .select()
        .from(classesTable)
        .where(eq(classesTable.id, Number(classId)));
      if (classExists.length === 0) {
        res.status(500).json({ message: "Class record not found" });
      } else {
        const classData = await db
          .select()
          .from(classesTable)
          .where(eq(classesTable.id, Number(classId)));
        res.status(200).json(classData);
      }
    } catch (error) {
      console.error("There was an error retreiving the record: ", error);
      res
        .status(500)
        .json({ message: "There was an error retreiving the record" });
    }
  })
  .post(async (req, res) => {
    const classId = req.params.classId;
    const updatedClassData = req.body;
    try {
      const classExists = await db
        .select()
        .from(classesTable)
        .where(eq(classesTable.id, Number(classId)));
      if (classExists.length === 0) {
        res.status(500).json({ message: "Class record not found" });
      } else {
        const filteredClassData = Object.fromEntries(
          Object.entries(updatedClassData).filter(
            (_, value) => value !== undefined,
          ),
        );
        await db
          .update(classesTable)
          .set(updatedClassData)
          .where(eq(classesTable.id, Number(classId)));

        res.status(200).json(filteredClassData);
      }
    } catch (error) {
      console.error("There was an error updating the class record", error);
      res
        .status(500)
        .json({ message: "There was an error updating the class record." });
    }
  });

router.delete("/classes/:classId/delete", (req, res) => {
  const classId = req.params.classId;
  res.status(200).json({ message: "Class deleted successfully!" });
});

interface SettingsPayload {
  [key: string]: string;
}

router
  .route("/settings")
  .get(async (req, res) => {
    console.log(req, "request from route");
    try {
      const allSettings = await db.select().from(settingsTable);
      console.log(allSettings, "allSettings");
      res.status(200).json(allSettings);
    } catch (error) {
      console.error("Error getting settings", error);
      res.status(500).json({ message: "Error getting settings." });
    }
  })
  .post(async (req, res) => {
    const settings = req.body as SettingsPayload[];

    await Promise.all(
      settings.map(async (setting) =>
        db
          .insert(settingsTable)
          .values(setting)
          .onConflictDoUpdate({
            target: settingsTable.settings_key,
            set: { settings_value: setting.settings_value },
          }),
      ),
    );
  });

export default router;
