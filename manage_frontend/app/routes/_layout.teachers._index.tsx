import { useLoaderData, Link } from "@remix-run/react";
import { getTeachers } from "~/data/data";
import { TeacherRecord } from "~/types/types";

export const loader = async () => {
  return await getTeachers();
};

const Teachers = () => {
  const teachers = useLoaderData<typeof loader>();
  return (
    <div>
      <Link to={"/teachers/add"}>
        <button className="btn-link">Add Teacher</button>
      </Link>
      <div className={"overflow-x-auto"}>
        <h1 className="text-xl">Teachers</h1>
        <table className="table table-xs">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Mobile Phone</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher: TeacherRecord) => {
              return (
                <tr key={teacher.id}>
                  <td>{teacher.id}</td>
                  <td>{teacher.teacher_first_name}</td>
                  <td>{teacher.teacher_last_name}</td>
                  <td>{teacher.teacher_email}</td>
                  <td>{teacher.teacher_mobile_phone}</td>
                  <td>{teacher.teacher_address}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Teachers;
