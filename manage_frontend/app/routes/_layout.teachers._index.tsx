import {
  useLoaderData,
  Link,
  useRevalidator,
  useFetcher,
} from "@remix-run/react";
import { deleteTeacher, getTeachers } from "~/data/data.server";
import { TeacherRecord } from "~/types/types";
import { useRef } from "react";
import { useToast } from "~/hooks/hooks";
import { ActionFunction, ActionFunctionArgs } from "@remix-run/node";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "delete") {
    const teacherId = formData.get("teacher_id");
    if (typeof teacherId === "string" && teacherId) {
      try {
        const result = await deleteTeacher(parseInt(teacherId, 10));
        if (result?.success) {
          return Response.json({
            success: true,
            message: "Teacher deleted successfully",
          });
        } else {
          return Response.json({
            success: false,
            message: "There was an error deleting the teacher",
          });
        }
      } catch (error) {
        console.error("There was an error deleting this teacher: ", error);
        return Response.json({
          success: false,
          message: "Server error deleting teacher",
        });
      }
    } else
      return Response.json({ success: false, message: "Invalid teacher ID" });
  } else {
    return Response.json({ success: false, message: "Invalid form intent" });
  }
};

export const loader = async () => {
  try {
    const teachers = await getTeachers();
    return Response.json({ teachers });
  } catch (error) {
    return Response.json(
      {
        message:
          "Sorry, there was an error getting the list of teachers. Please try again later.",
      },
      { status: 500 }
    );
  }
};

const Teachers = () => {
  const loaderData = useLoaderData<{
    message?: string;
    teachers?: TeacherRecord[];
  }>();
  const teachers = loaderData.teachers;
  const confirmationRef = useRef<HTMLDialogElement>(null);
  let teacherIdToDelete: number | undefined;
  const revalidate = useRevalidator();
  const fetcher = useFetcher();
  const toast = useToast();
  const handleDeleteClick = (id: number | undefined) => {
    confirmationRef.current?.showModal();
    teacherIdToDelete = id;
  };

  const handleDeleteConfirmation = () => {
    if (teacherIdToDelete !== undefined) {
      fetcher.submit(
        {
          intent: "delete",
          teacher_id: teacherIdToDelete.toString(),
        },
        { method: "POST" }
      );
      revalidate.revalidate();
      teacherIdToDelete = undefined;
      confirmationRef.current?.close();
      toast.success("Teacher deleted successfully");
    } else return toast.error("There was an error deleting the teacher");
  };

  if (loaderData.message) {
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
        <span>{loaderData.message}</span>
      </div>
    );
  }

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
          {teachers?.length
            ? teachers?.map((teacher: TeacherRecord) => {
                return (
                  <tr key={teacher.id}>
                    <td>{teacher.id}</td>
                    <td>
                      <Link
                        to={`/teachers/${teacher.id?.toString()}`}
                        className="hover:underline hover:text-blue-500"
                        title="Click to see teacher info"
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
              })
            : null}
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
