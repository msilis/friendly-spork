import express, { Request, Response } from "express";
import { drizzle } from "drizzle-orm/libsql";
import "dotenv/config";
import { eq } from "drizzle-orm";
import { studentTable, familyTable, teacherTable } from "../db/dbSchema.mts";

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

//@ts-ignore -- ignoring for now
router.post("/students/add", async (req: Request, res: Response) => {
  const parsedBody = await req.body;

  if (
    !parsedBody.first_name ||
    !parsedBody.last_name ||
    !parsedBody.birthdate
  ) {
    return res.status(400).json({ error: "Missing fields" });
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
    return res.status(200).json({ message: "Student added successfully!" });
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
  .put(async (req, res) => {
    const studentId = req.params.studentId;
    const updatedStudentData = req.body;

    res.status(200).json({ message: "Student data updated successfully!" });
  });

router.delete("/students/:studentId/delete", (req, res) => {
  const studentId = req.params.studentId;

  res.status(200).json({ message: "Student deleted successfully!" });
});

router.get("/students", async (req, res) => {
  const allStudents = await db.select().from(studentTable);
  res.status(200).json(allStudents);
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
  .put((req, res) => {
    const familyId = req.params.familyId;
    const updatedFamilyData = req.body;

    res.status(200).json({ message: "Family updated successfully!" });
  });

router.delete("/families/:familyId/delete", (req, res) => {
  const familyId = req.params.familyId;

  res.status(200).json({ message: "Family deleted successfully!" });
});

router.get("/families", async (req, res) => {
  const allFamilies = await db.select().from(familyTable);
  res.status(200).json(allFamilies);
});

//Teacher Management

router.post("/teachers/add", async (req, res) => {
  const {
    teacher_first_name,
    teacher_last_name,
    teacher_email,
    teacher_mobile_phone,
    teacher_address,
  } = req.body;
  try {
    const teacherToAdd = {
      teacher_first_name,
      teacher_last_name,
      teacher_email,
      teacher_mobile_phone,
      teacher_address,
    };
    await db.insert(teacherTable).values(teacherToAdd);
    res.status(200).json({ message: "Teacher added successfully!" });
  } catch (error) {
    console.error("There was an error creating the teacher record", error);
  }
});

router
  .route("/teachers/:teacherId/edit")
  .get((req, res) => {
    const teacherId = req.params.teacherId;
  })
  .put((req, res) => {
    const teacherId = req.params.teacherId;
    const updatedTeacherData = req.body;

    res.status(200).json({ message: "Teacher updated successfully!" });
  });

router.delete("/teachers/:teacherId/delete", (req, res) => {
  const teacherId = req.params.teacherId;
  res.status(200).json({ message: "Teacher deleted successfully!" });
});

router.get("/teachers", async (req, res) => {
  const allTeachers = await db.select().from(teacherTable);
  res.status(200).json(allTeachers);
});

//Class Management

router.post("/classes/add", (req, res) => {});

router
  .route("/classes/:classId/edit")
  .get((req, res) => {
    const classId = req.params.classId;
  })
  .put((req, res) => {
    const classId = req.params.classId;
    const updatedClassData = req.body;

    res.status(200).json({ message: "Class updated successfully!" });
  });

router.delete("/classes/:classId/delete", (req, res) => {
  const classId = req.params.classId;
  res.status(200).json({ message: "Class deleted successfully!" });
});

router.get("/classes", async (req, res) => {});

export default router;
