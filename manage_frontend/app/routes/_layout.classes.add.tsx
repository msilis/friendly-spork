import { FormEvent, useState } from "react";
import { json, Link, useLoaderData, useNavigate } from "@remix-run/react";

import {
  addClass,
  getTeachers,
  getStudents,
  getAccompanists,
} from "~/data/data";
import Select from "react-select";
import { SelectOption, StudentRecord, TeacherRecord } from "~/types/types";

export const loader = async () => {
  const [studentData, teacherData, accompanistData] = await Promise.all([
    getStudents(),
    getTeachers(),
    getAccompanists(),
  ]);
  return json({ studentData, teacherData, accompanistData });
};

const AddClass = () => {
  const [formState, setFormState] = useState({
    class_name: "",
    class_location: "",
    class_start_time: "",
    class_end_time: "",
    class_students: [],
    class_teacher: {},
    class_accompanist: "",
  });
  const { studentData, teacherData, accompanistData } =
    useLoaderData<typeof loader>();

  const navigate = useNavigate();

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      typeof formState.class_name !== "string" ||
      typeof formState.class_location !== "string" ||
      typeof formState.class_start_time !== "string" ||
      typeof formState.class_end_time !== "string" ||
      typeof formState.class_teacher !== "number" ||
      typeof formState.class_accompanist !== "number"
    ) {
      throw new Error("Invalid form data");
    }

    if (formState.class_students) {
      let teacher = formState.class_teacher;
      if (formState.class_teacher) {
        teacher = Number(formState.class_teacher);
      }
      await addClass({
        class_name: formState.class_name,
        class_location: formState.class_location,
        class_start_time: formState.class_start_time,
        class_end_time: formState.class_end_time,
        class_students: formState.class_students,
        class_teacher: teacher,
        class_accompanist: formState.class_accompanist,
      });
    }
    navigate("/classes");
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState({ ...formState, [name]: value });
  };

  const handleSelectChange = (
    value: SelectOption,
    event: { action: string; name: string; option: string }
  ) => {
    const eventName = event.name;

    if (eventName === "class_students") {
      if (Array.isArray(value)) {
        const newStudents = value.map((student) => student.value);
        setFormState({ ...formState, [eventName]: newStudents });
      }
    } else if (eventName === "class_teacher") {
      setFormState({ ...formState, [eventName]: value.value });
    } else if (eventName === "class_accompanist") {
      setFormState({ ...formState, [eventName]: value.value });
    }
  };
  console.log(formState, "formState");
  return (
    <div>
      <Link to={"/classes"}>
        <button className="btn-link">Back</button>
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
          onChange={(event, value) => handleSelectChange(event, value)}
        />
        <label htmlFor="class_teacher">Class Teacher</label>
        <Select
          options={teacherOptions}
          name="class_teacher"
          onChange={(event, value) => handleSelectChange(event, value)}
        />
        <label htmlFor="class_accompanist">Accompanist</label>
        <Select
          options={accompanistOptions}
          name="class_accompanist"
          onChange={(event, value) => handleSelectChange(event, value)}
        />
        <button
          onClick={handleSubmit}
          className="btn-neutral btn-active w-fit p-3"
        >
          Add Class
        </button>
      </form>
    </div>
  );
};

export default AddClass;
