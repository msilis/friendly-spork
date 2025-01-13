import { useParams, useNavigate, useLoaderData, Link } from "@remix-run/react";
import { useClassContext } from "~/contexts/classContext";
import { getSettings } from "~/data/data";

export const loader = async () => {
  const settings = await getSettings();
  return Response.json(settings);
};

type SettingsType = {
  settings_key: string;
  settings_value: string;
};

const Register = () => {
  const params = useParams();
  const navigate = useNavigate();
  const settings = useLoaderData<typeof loader>();

  const handleBackClick = () => {
    navigate(`/classes/${params.id}`);
  };
  const {
    classInformation,
    setClassInformation,
    studentInformation,
    setStudentInformation,
    teacherInformation,
    setTeacherInformation,
  } = useClassContext();

  const hasSetTermDate = settings.some(
    (setting: SettingsType) => setting.settings_key === "term1_start_date"
  );

  const hasSetHalfTermDates = settings.some(
    (setting: SettingsType) =>
      setting.settings_key === "term1_halfterm_start_date"
  );

  if (!hasSetTermDate || !hasSetHalfTermDates) {
    return (
      <div>
        <h2>
          You have not set term dates or you have not set half-term dates.
        </h2>
        <h3>
          Please go to <Link to={"/settings"}>Settings.</Link>
        </h3>
      </div>
    );
  }

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
