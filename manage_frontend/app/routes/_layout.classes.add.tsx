import { Form, json, Link, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import {
  addClass,
  getTeachers,
  getStudents,
  getAccompanists,
} from "~/data/data";
import Select from "react-select";
import { StudentRecord, TeacherRecord } from "~/types/types";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const className = body.get("class_name");
  const classLocation = body.get("class_location");
  const classStartTime = body.get("class_start_time");
  const classEndTime = body.get("class_end_time");
  const classStudents = body.get("class_students") as string[] | null;
  const classTeacher = body.get("class_teacher");
  const classAccompanist = body.get("class_accompanist");

  console.log(classStudents, "classStudents");
  console.log(classTeacher, "classTeacher");
  console.log(classAccompanist, "classAccompanist");

  if (
    typeof className !== "string" ||
    typeof classLocation !== "string" ||
    typeof classStartTime !== "string" ||
    typeof classEndTime !== "string" ||
    typeof classTeacher !== "string" ||
    typeof classAccompanist !== "string" ||
    (Array.isArray(classStudents) &&
      classStudents?.every((student) => typeof student === "string"))
  ) {
    throw new Error("Invalid form data");
  }
  console.log("should be adding students");
  if (classStudents) {
    await addClass({
      class_name: className,
      class_location: classLocation,
      class_start_time: classStartTime,
      class_end_time: classEndTime,
      class_strudents: classStudents,
      class_teacher: classTeacher,
      class_accompanist: classAccompanist,
    });
  }
  return redirect("/classes");
};

export const loader = async () => {
  const [studentData, teacherData, accompanistData] = await Promise.all([
    getStudents(),
    getTeachers(),
    getAccompanists(),
  ]);
  return json({ studentData, teacherData, accompanistData });
};

const AddClass = () => {
  const { studentData, teacherData, accompanistData } =
    useLoaderData<typeof loader>();

  const studentOptions = studentData.map((student: StudentRecord) => ({
    value: student.id,
    label: `${student.last_name}, ${student.first_name}`,
  }));

  const teacherOptions = teacherData.map((teacher: TeacherRecord) => ({
    value: teacher.id,
    label: `${teacher.teacher_last_name}, ${teacher.teacher_first_name}`,
  }));

  const accompanistOptions = accompanistData.map(
    (accompanist: TeacherRecord) => ({
      value: accompanist.id,
      label: `${accompanist.teacher_last_name}, ${accompanist.teacher_first_name}`,
    })
  );

  return (
    <div>
      <Link to={"/classes"}>
        <button className="btn-link">Back</button>
      </Link>
      <Form className="flex flex-col gap-3 ml-8 w-4/12" method="POST">
        <h2>Add Class</h2>
        <input
          name="class_name"
          placeholder="Class name"
          type="text"
          className="input input-bordered w-full max-w-xs"
        />
        <input
          name="class_location"
          placeholder="Class location"
          type="text"
          className="input input-bordered w-full max-w-xs"
        />
        <label htmlFor="class_start_time">Class start time</label>
        <input
          name="class_start_time"
          type="time"
          className="input input-bordered w-full max-w-xs"
        />
        <label htmlFor="class_end_time">Class end time</label>
        <input
          name="class_end_time"
          type="time"
          className="input input-bordered w-full max-w-xs"
        />
        <label htmlFor="class_students">Students</label>
        <Select
          id="class_students"
          name="class_students"
          options={studentOptions}
          isMulti={true}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
        />
        <label htmlFor="class_teacher">Class Teacher</label>
        <Select options={teacherOptions} name="class_teacher" />
        <label htmlFor="class_accompanist">Accompanist</label>
        <Select options={accompanistOptions} name="class_accompanist" />
        <button type="submit" className="btn-neutral btn-active w-fit p-3">
          Add Student
        </button>
      </Form>
    </div>
  );
};

export default AddClass;
