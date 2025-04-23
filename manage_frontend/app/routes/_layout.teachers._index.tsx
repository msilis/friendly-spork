import { useLoaderData, Link, useRevalidator } from "@remix-run/react";
import { deleteTeacher, getTeachers } from "~/data/data";
import { TeacherRecord } from "~/types/types";
import { useRef } from "react";
import { useToast } from "~/hooks/hooks";

export const loader = async () => {
  return await getTeachers();
};

const Teachers = () => {
  const teachers = useLoaderData<typeof loader>();
  const confirmationRef = useRef<HTMLDialogElement>(null);
  let teacherIdToDelete: number | undefined;
  const revalidate = useRevalidator();
  const toast = useToast();
  const handleDeleteClick = (id: number | undefined) => {
    confirmationRef.current?.showModal();
    teacherIdToDelete = id;
  };

  const handleDeleteConfirmation = () => {
    deleteTeacher(teacherIdToDelete);
    revalidate.revalidate();
    teacherIdToDelete = undefined;
    confirmationRef.current?.close();
    toast.success("Teacher deleted successfully");
  };
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {teachers?.map((teacher: TeacherRecord) => {
            return (
              <tr key={teacher.id}>
                <td>{teacher.id}</td>
                <td>
                  <Link
                    to={`/teachers/${teacher.id?.toString()}`}
                    className="hover:underline hover:text-blue-500"
                  >
                    {teacher.teacher_first_name}
                  </Link>
                </td>
                <td>{teacher.teacher_last_name}</td>
                <td>{teacher.teacher_email}</td>
                <td>{teacher.teacher_mobile_phone}</td>
                <td>{teacher.teacher_address}</td>
                <td>
                  <button
                    onClick={() => handleDeleteClick(teacher.id)}
                    title="Delete"
                  >
                    <img
                      src="icons8-delete.svg"
                      alt="delete student"
                      className="hover:cursor-pointer"
                    />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <dialog ref={confirmationRef} className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => confirmationRef.current?.close()}
          >
            ✕
          </button>
          <p>Are you sure you want to delete this teacher?</p>
          <div className="flex gap-4 mt-4">
            <button
              className="btn btn-secondary"
              onClick={() => confirmationRef.current?.close()}
            >
              Cancel
            </button>
            <button
              className="btn btn-accent"
              onClick={handleDeleteConfirmation}
            >
              Yes
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Teachers;
