import { FormEvent, useState } from "react";
import { Link, useLoaderData, useNavigate, useFetcher } from "@remix-run/react";

import {
  addClass,
  getTeachers,
  getStudents,
  getAccompanists,
} from "~/data/data.server";
import Select, { MultiValue, SingleValue } from "react-select";
import { ClassRecord, StudentRecord, TeacherRecord } from "~/types/types";
import { ActionFunction, ActionFunctionArgs } from "@remix-run/node";
import { useToast } from "~/hooks/hooks";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const newClass = formData.get("class_data");
  if (!newClass) {
    return Response.json({ success: false, message: "Error in form" });
  }
  if (typeof newClass === "string" && newClass) {
    try {
      const parsedData = JSON.parse(newClass);
      const result = await addClass(parsedData);
      if (result?.success) {
        return Response.json({ success: true, message: "Class added" });
      } else
        return Response.json({
          success: true,
          message: "There was an error adding this class.",
        });
    } catch (error) {
      console.error("Error in adding class: ", error);
      return Response.json({ success: false, message: "Error adding class" });
    }
  }
};

export const loader = async () => {
  const [studentData, teacherData, accompanistData] = await Promise.all([
    getStudents(),
    getTeachers(),
    getAccompanists(),
  ]);
  return Response.json({ studentData, teacherData, accompanistData });
};

const AddClass = () => {
  const [formState, setFormState] = useState<ClassRecord>({
    class_name: "",
    class_location: "",
    class_start_time: "",
    class_end_time: "",
    class_students: [],
    class_teacher: 0,
    class_accompanist: 0,
  });
  const { studentData, teacherData, accompanistData } =
    useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const toast = useToast();

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
  const allAccompanistOptions = [
    { value: "", label: "No accompanist" },
    ...accompanistOptions,
  ];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      typeof formState.class_name !== "string" ||
      typeof formState.class_location !== "string" ||
      typeof formState.class_start_time !== "string" ||
      typeof formState.class_end_time !== "string" ||
      typeof formState.class_teacher !== "number" ||
      !(
        typeof formState.class_accompanist === "number" ||
        formState.class_accompanist === null
      )
    ) {
      throw new Error("Invalid form data");
    }

    if (formState.class_students) {
      let teacher = formState.class_teacher;
      if (formState.class_teacher) {
        teacher = Number(formState.class_teacher);
      }
      const classData = {
        class_name: formState.class_name,
        class_location: formState.class_location,
        class_start_time: formState.class_start_time,
        class_end_time: formState.class_end_time,
        class_students: formState.class_students,
        class_teacher: teacher,
        class_accompanist: formState.class_accompanist,
      };
      if (classData !== undefined) {
        fetcher.submit(
          {
            class_data: JSON.stringify(classData),
          },
          {
            method: "POST",
          }
        );
        navigate("/classes");
      } else toast.error("There was an error adding this class :/");
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState({ ...formState, [name]: value });
  };

  const handleSelectChange =
    (name: string) =>
    (newValue: MultiValue<{ value: string; label: string }>) => {
      const selectedOptions = newValue
        ? newValue.map((option) => option.value)
        : [];
      setFormState({ ...formState, [name]: selectedOptions });
    };

  const handleSingleSelectChange =
    (name: string) =>
    (newValue: SingleValue<{ value: string; label: string }>) => {
      let valueToStore: string | number | undefined | null = null;
      if (name === "class_accompanist" && newValue?.value === "") {
        valueToStore = null;
      } else valueToStore = newValue?.value;
      return setFormState({ ...formState, [name]: valueToStore });
    };

  return (
    <div className="ml-8">
      <Link to={"/classes"}>
        <button className="btn btn-sm mt-1 mb-1">
          <img
            src="../arrow-left.svg"
            alt="back-arrow"
            height="20"
            width="25"
          />
          Back
        </button>
      </Link>
      <form className="flex flex-col gap-3 ml-8 w-4/12" onSubmit={handleSubmit}>
        <h2>Add Class</h2>
        <input
          name="class_name"
          placeholder="Class name"
          type="text"
          className="input input-bordered w-full max-w-xs"
          onChange={handleChange}
        />
        <input
          name="class_location"
          placeholder="Class location"
          type="text"
          className="input input-bordered w-full max-w-xs"
          onChange={handleChange}
        />
        <label htmlFor="class_start_time">Class start time</label>
        <input
          name="class_start_time"
          type="time"
          className="input input-bordered w-full max-w-xs"
          onChange={handleChange}
        />
        <label htmlFor="class_end_time">Class end time</label>
        <input
          name="class_end_time"
          type="time"
          className="input input-bordered w-full max-w-xs"
          onChange={handleChange}
        />
        <label htmlFor="class_students">Students</label>
        <Select
          id="class_students"
          name="class_students"
          options={studentOptions}
          isMulti={true}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          onChange={handleSelectChange("class_students")}
        />
        <label htmlFor="class_teacher">Class Teacher</label>
        <Select
          options={teacherOptions}
          name="class_teacher"
          onChange={handleSingleSelectChange("class_teacher")}
        />
        <label htmlFor="class_accompanist">Accompanist</label>
        <Select
          options={allAccompanistOptions}
          name="class_accompanist"
          onChange={handleSingleSelectChange("class_accompanist")}
        />
        <button type="submit" className="btn-neutral btn-active w-fit p-3">
          Add Class
        </button>
      </form>
    </div>
  );
};

export default AddClass;
