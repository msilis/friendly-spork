import { useLoaderData } from "@remix-run/react";
import { getStudents } from "~/data/data";
import { StudentRecord } from "~/types/types";

export const loader = async () => {
  return await getStudents();
};
const Students = () => {
  const students = useLoaderData<typeof loader>();

  return (
    <div className="overflow-x-auto">
      <h1 className="text-xl">Students</h1>
      <table className="table table-xs">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Birthdate</th>
            <th>Teacher</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student: StudentRecord) => {
            return (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.first_name}</td>
                <td>{student.last_name}</td>
                <td>{student.birthdate}</td>
                <td>{student.teacher_id ? student.teacher_id : "None"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
