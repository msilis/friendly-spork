import { useLoaderData, Link, json } from "@remix-run/react";
import { getFamilies, getStudents, getTeachers } from "~/data/data";
import { FamilyRecord, StudentRecord, TeacherRecord } from "~/types/types";

export const loader = async () => {
  const [students, families, teachers] = await Promise.all([
    getStudents(),
    getFamilies(),
    getTeachers(),
  ]);
  return json({ students, families, teachers });
};

const Students = () => {
  const { students, families, teachers } = useLoaderData<typeof loader>();
  const getFamilyLastName = (student: StudentRecord) => {
    const name =
      families.find((family: FamilyRecord) => family.id === student.family_id)
        ?.family_last_name || "Not assigned";

    return name;
  };

  const getTeacherLastName = (student: StudentRecord) => {
    const name =
      teachers.find(
        (teacher: TeacherRecord) => teacher.id === student.teacher_id
      )?.teacher_last_name || "Not assigned";
    return name;
  };

  return (
    <div>
      <Link to={"/students/add"}>
        <button className="btn-link">Add Student</button>
      </Link>
      <div className="overflow-x-auto">
        <h1 className="text-xl">Students</h1>
        <table className="table table-xs">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Birthdate</th>
              <th>Family</th>
              <th>Teacher</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student: StudentRecord) => {
              return (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>
                    <Link to={`/students/${student.id?.toString()}`}>
                      {student.first_name}
                    </Link>
                  </td>
                  <td>{student.last_name}</td>
                  <td>{student.birthdate}</td>
                  <td>{getFamilyLastName(student)}</td>
                  <td>{getTeacherLastName(student)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
