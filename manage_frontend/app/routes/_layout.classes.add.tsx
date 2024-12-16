import { Form, json, Link, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { addClass, getTeachers, getStudents } from "~/data/data";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const className = body.get("class_name");
  const classLocation = body.get("class_location");
  const classStartTime = body.get("class_start_time");
  const classEndTime = body.get("class_end_time");
  const classStudents = body.get("class_students") as string[] | null;
  const classTeacher = body.get("class_teacher");
  const classAccompanist = body.get("class_accompanist");

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
  const [studentData, teacherData] = await Promise.all([
    getStudents(),
    getTeachers(),
  ]);
  return json({ studentData, teacherData });
};

const AddClass = () => {
  return (
    <div>
      <Link to={"/classes"}>
        <button className="btn-link">Back</button>
      </Link>
      <Form className="flex flex-col gap-3 ml-8" method="POST">
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
      </Form>
    </div>
  );
};

export default AddClass;
