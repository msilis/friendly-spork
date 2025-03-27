import { useLoaderData } from "@remix-run/react";
import { getFamilies, getStudents, getTeachers } from "~/data/data";
import {
  generateStudentTable,
  generateTeacherTable,
} from "~/utils/table-utils";
import { useState } from "react";

export const loader = async () => {
  const [families, students, teachers] = await Promise.all([
    getFamilies(),
    getStudents(),
    getTeachers(),
  ]);
  return Response.json({ families, students, teachers });
};

const Reports = () => {
  const { families, students, teachers } = useLoaderData<typeof loader>();
  const [dataToDisplay, setDataToDisplay] = useState();
  const handleStudentClick = () => {
    const generatedTable = generateStudentTable(
      students,
      teachers,
      families,
      "student-table"
    );
    setDataToDisplay(generatedTable);
  };

  const handleTeacherClick = () => {
    const generatedTeacherTable = generateTeacherTable(
      teachers,
      "teacher-table"
    );
    setDataToDisplay(generatedTeacherTable);
  };

  return (
    <div>
      <h1 className="text-xl font-bold">Reports</h1>
      <p className="ml-2">Generate various reports</p>
      <div className="flex gap-2 p-3">
        <button
          className="btn btn-outline btn-primary btn-sm"
          onClick={handleStudentClick}
        >
          Student Report
        </button>
        <button className="btn btn-outline btn-primary btn-sm ">
          Families Report
        </button>
        <button
          className="btn btn-outline btn-primary btn-sm"
          onClick={handleTeacherClick}
        >
          Teacher Report
        </button>
        <button
          className="btn btn-outline btn-secondary btn-sm"
          onClick={() => setDataToDisplay(undefined)}
        >
          Clear
        </button>
      </div>
      <div>{dataToDisplay}</div>
    </div>
  );
};

export default Reports;
