import { useLoaderData, Link } from "@remix-run/react";
import { getTeachers } from "~/data/data";
import { TeacherRecord } from "~/types/types";

export const loader = async () => {
  return await getTeachers();
};

const Teachers = () => {
  const teachers = useLoaderData<typeof loader>();
  return (
    <div className={"overflow-x-auto"}>
      <h1 className="text-xl font-bold mb-4">Teachers</h1>
      <Link to={"/teachers/add"}>
        <button className="btn btn-outline btn-primary btn-sm mb-4">
          Add Teacher
        </button>
      </Link>
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
          {teachers?.map((teacher: TeacherRecord) => {
            return (
              <tr key={teacher.id}>
                <td>{teacher.id}</td>
                <td>
                  <Link to={`/teachers/${teacher.id?.toString()}`}>
                    {teacher.teacher_first_name}
                  </Link>
                </td>
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
  );
};

export default Teachers;
