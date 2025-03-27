import { Link, useLoaderData } from "@remix-run/react";
import { getFamilies, getStudents, getTeachers } from "~/data/data";

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
  return (
    <div>
      <h1 className="text-xl font-bold">Reports</h1>
      <p className="ml-2">Generate various reports</p>
      <div className="flex gap-2 p-3">
        <button className="btn btn-outline btn-primary btn-sm">
          Student Report
        </button>
        <button className="btn btn-outline btn-primary btn-sm ">
          Families Report
        </button>
        <button className="btn btn-outline btn-primary btn-sm ">
          Teacher Report
        </button>
      </div>
    </div>
  );
};

export default Reports;
