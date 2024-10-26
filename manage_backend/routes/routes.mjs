import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("You are at the right place");
});

//Authentication/Authorisation

router.post("/login", (req, res) => {});

router.get("/logout", (req, res) => {});

router.post("/signup", (req, res) => {});

//Student Management

router.post("/students/add", (req, res) => {});

router
  .route("/students/:studentId/edit")
  .get((req, res) => {
    const studentId = req.params.studentId;
  })
  .put((req, res) => {
    const studentId = req.params.studentId;
    const updatedStudentData = req.body;

    res.status(200).json({ message: "Student data updated successfully!" });
  });

router.delete("/students/:studentId/delete", (req, res) => {
  const studentId = req.params.studentId;

  res.status(200).json({ message: "Student deleted successfully!" });
});

router.get("/students", (req, res) => {});

//Family Management

router.post("/families/add", (req, res) => {
  res.status(200).json({ message: "Family added successfully!" });
});

router
  .route("/families/:familyId/edit")
  .get((req, res) => {
    const familyId = req.params.familyId;
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

router.get("/families", (req, res) => {});

//Teacher Management

router.post("/teachers/add", (req, res) => {});

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

router.get("/teachers", (req, res) => {});

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

router.get("/classes", (req, res) => {});

export default router;
