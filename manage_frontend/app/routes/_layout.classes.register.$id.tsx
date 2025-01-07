import { useParams, useNavigate, useLoaderData, json } from "@remix-run/react";
import { useClassContext } from "~/contexts/classContext";
import { getFamilies } from "~/data/data";

export const loader = async () => {
  const families = await getFamilies();
  return json(families);
};

const Register = () => {
  const params = useParams();
  const navigate = useNavigate();
  const families = useLoaderData<typeof loader>();
  const handleBackClick = () => {
    navigate(`/classes/${params.id}`);
  };
  const { classInformation, studentInformation, teacherInformation } =
    useClassContext();

  return (
    <div>
      <h2>Register</h2>
      <button className="btn btn-link" onClick={handleBackClick}>
        Back
      </button>
    </div>
  );
};

export default Register;
