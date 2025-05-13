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
  try {
    const [families, students, teachers, classes] = await Promise.all([
      getFamilies(),
      getStudents(),
      getTeachers(),
      getClasses(),
    ]);
    return Response.json({ families, students, teachers, classes });
  } catch (error) {
    console.error("There was an error getting info from the database: ", error);
    return Response.json(
      {
        message:
          "Sorry, there was an error getting info from the database. Please try again later.",
      },
      { status: 500 }
    );
  }
};

const Reports = () => {
  const { families, students, teachers, classes, message } =
    useLoaderData<typeof loader>();
  const errorMessage = message;
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
      students,
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

  if (errorMessage) {
    return (
      <div className="alert alert-error w-5/6 mt-8">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          className="w-6 h-6 stroke-current mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path>
        </svg>
        <span>{errorMessage}</span>
      </div>
    );
  }

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
