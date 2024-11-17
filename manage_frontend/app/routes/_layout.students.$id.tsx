import { Link, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { getStudent } from "~/data/data";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return await getStudent(params.id);
};

const Student = () => {
  const studentData = useLoaderData<typeof loader>();
  const student = studentData[0];
  console.log(student);
  return (
    <>
      <Link to={"/students"}>
        <button className="btn-link">Back</button>
      </Link>
      <section className="ml-12 flex">
        <div>
          <h1 className="font-semibold text-lg pb-4 pt-4">Student info</h1>
          <h2 className="font-light mb-2">Student First Name</h2>
          <p className="pb-4">{student.first_name}</p>
          <h2 className="font-light mb-2">Student Last Name</h2>
          <p className="pb-4">{student.last_name}</p>
          <h2 className="font-light mb-2">Birthdate</h2>
          <p className="pb-4">{student.birthdate}</p>
          <h2 className="font-light mb-2">Family</h2>
          <p className="pb-4">
            {student.family_id ? student.family_id : "Not assigned"}
          </p>
        </div>
      </section>
    </>
  );
};

export default Student;
