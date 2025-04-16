import { useLoaderData, useSearchParams } from "@remix-run/react";
import { getClasses, getFamilies, getStudents, getTeachers } from "~/data/data";
import {
  generateFamilyTable,
  generateStudentTable,
  generateTeacherTable,
  generateClassTable,
} from "~/utils/table-utils";
import { useState } from "react";
import { handleSaveClick } from "~/utils/pdf-utils";
import { useToast } from "~/hooks/hooks";

export const loader = async () => {
  const [families, students, teachers, classes] = await Promise.all([
    getFamilies(),
    getStudents(),
    getTeachers(),
    getClasses(),
  ]);
  return Response.json({ families, students, teachers, classes });
};

const Reports = () => {
  const { families, students, teachers, classes } =
    useLoaderData<typeof loader>();
  const [dataToDisplay, setDataToDisplay] = useState<React.ReactElement>();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams();
  const toast = useToast();
  const handleStudentClick = () => {
    const generatedTable = generateStudentTable(
      students,
      teachers,
      families,
      "student-table"
    );
    setDataToDisplay(generatedTable);
    params.set("table", "student-table");
    setSearchParams(params, { preventScrollReset: true });
  };

  const handleTeacherClick = () => {
    const generatedTeacherTable = generateTeacherTable(
      teachers,
      "teacher-table"
    );
    setDataToDisplay(generatedTeacherTable);
    params.set("table", "teacher-table");
    setSearchParams(params, { preventScrollReset: true });
  };

  const handleFamilyClick = () => {
    const generatedFamilyTable = generateFamilyTable(families, "family-table");
    setDataToDisplay(generatedFamilyTable);
    params.set("table", "family-table");
    setSearchParams(params, { preventScrollReset: true });
  };

  const handleClassClick = () => {
    const generatedClassTable = generateClassTable(
      classes,
      teachers,
      "class-table"
    );
    setDataToDisplay(generatedClassTable);
    params.set("table", "class-table");
    setSearchParams(params, { preventScrollReset: true });
  };

  const handleClearClick = () => {
    setDataToDisplay(undefined);
    params.set("", "");
    setSearchParams(params, { preventScrollReset: true });
  };

  const handleSavePDFClick = () => {
    const table = searchParams.get("table");
    if (table) {
      handleSaveClick(table, `test-report`, 40);
    } else {
      toast.error("Error with table");
    }
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
        <button
          className="btn btn-outline btn-primary btn-sm"
          onClick={handleFamilyClick}
        >
          Families Report
        </button>
        <button
          className="btn btn-outline btn-primary btn-sm"
          onClick={handleTeacherClick}
        >
          Teacher Report
        </button>
        <button
          className="btn btn-outline btn-primary btn-sm"
          onClick={handleClassClick}
        >
          Class Report
        </button>
        <button
          className="btn btn-outline btn-secondary btn-sm"
          onClick={handleClearClick}
        >
          Clear
        </button>
      </div>
      <div>{dataToDisplay}</div>
      <div>
        {dataToDisplay && (
          <button
            className="btn btn-outline btn-primary btn-sm mt-4"
            onClick={handleSavePDFClick}
          >
            Save PDF
          </button>
        )}
      </div>
    </div>
  );
};

export default Reports;
