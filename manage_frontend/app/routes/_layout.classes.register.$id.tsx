import { useParams, useNavigate, useLoaderData, Link } from "@remix-run/react";
import { useClassContext } from "~/contexts/classContext";
import { getSettings } from "~/data/data";
import { useState, useEffect } from "react";
import { getWednesdays, handleSaveClick } from "~/utils/utils";
import { TeacherRecord, StudentRecord } from "~/types/types";

export const loader = async () => {
  const settings = await getSettings();
  return Response.json(settings);
};

type SettingsType = {
  settings_key: string;
  settings_value: string;
};

type DateEntry = {
  date: Date;
  type: string;
};

const Register = () => {
  const params = useParams();
  const navigate = useNavigate();
  const settings = useLoaderData<typeof loader>();
  const [term, setTerm] = useState<string>("1");
  const [allDates, setAllDates] = useState<DateEntry[]>();

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

  const handleTermChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTerm(event.target.value);
  };

  useEffect(() => {
    const getTermDates = (term: number | string) => {
      const startDate = settings.filter(
        (setting: SettingsType) =>
          setting.settings_key === `term${term.toString()}_start_date`
      );
      const endDate = settings.filter(
        (setting: SettingsType) =>
          setting.settings_key === `term${term.toString()}_end_date`
      );

      return [startDate[0].settings_value, endDate[0].settings_value];
    };

    const getHalfTermDates = (term: number | string) => {
      const halfTermStartDate = settings.filter(
        (setting: SettingsType) =>
          setting.settings_key === `term${term.toString()}_halfterm_startdate`
      );
      const halfTermEndDate = settings.filter(
        (setting: SettingsType) =>
          setting.settings_key === `term${term.toString()}_halfterm_enddate`
      );
      return [
        halfTermStartDate[0].settings_value,
        halfTermEndDate[0].settings_value,
      ];
    };
    const termDatesToSet = getTermDates(term);
    const halfTermDatesToSet = getHalfTermDates(term);
    const classes = getWednesdays(termDatesToSet[0], termDatesToSet[1]);
    const halfTerms = getWednesdays(
      halfTermDatesToSet[0],
      halfTermDatesToSet[1]
    );

    const allDatesArray: DateEntry[] = [
      ...classes.map((date) => ({ date, type: "class" })),
      ...halfTerms.map((date) => ({ date, type: "break" })),
    ];

    allDatesArray.sort((a, b) => a.date.getTime() - b.date.getTime());

    setAllDates(allDatesArray);
  }, [term, settings]);

  useEffect(() => {
    if (!classInformation) {
      const storedClassInformation = sessionStorage.getItem("classInformation");
      if (storedClassInformation) {
        setClassInformation(JSON.parse(storedClassInformation));
      }
    }
    if (!studentInformation) {
      const storedStudentInformation =
        sessionStorage.getItem("studentInformation");
      if (storedStudentInformation) {
        setStudentInformation(JSON.parse(storedStudentInformation));
      }
    }
    if (!teacherInformation) {
      const storedTeacherInformation =
        sessionStorage.getItem("teacherInformation");
      if (storedTeacherInformation) {
        setTeacherInformation(JSON.parse(storedTeacherInformation));
      }
    }
  }, [
    classInformation,
    setClassInformation,
    teacherInformation,
    setTeacherInformation,
    studentInformation,
    setStudentInformation,
  ]);

  const hasSetHalfTermDates = settings.some(
    (setting: SettingsType) =>
      setting.settings_key === "term1_halfterm_startdate"
  );

  const findTeacher = (id: number | undefined) => {
    const teacher = teacherInformation?.find(
      (teacher: TeacherRecord) => teacher.id === id
    );
    return teacher;
  };

  const findStudent = (id: number | undefined) => {
    const student = studentInformation?.find(
      (student: StudentRecord) => student.id === id
    );
    return student;
  };

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

  const getAge = (birthDate: string, currentDate: string) => {
    const dateOne: Date = new Date(birthDate);
    const dateTwo: Date = new Date(currentDate);

    const years = dateTwo.getFullYear() - dateOne.getFullYear();
    return years;
  };

  const filteredDates = allDates?.filter((entry, index, array) => {
    const entryDate = new Date(entry.date).getTime();
    const hasBreak = array.some(
      (e) => e.type === "break" && new Date(e.date).getTime() === entryDate
    );
    return !(entry.type === "class" && hasBreak);
  });

  const currentDate = new Date();
  const handleClick = () => {
    handleSaveClick(
      "register-table",
      `${classInformation?.class_name}-register`
    );
  };

  return (
    <div>
      <h2>Register</h2>
      <button className="btn btn-link" onClick={handleBackClick}>
        Back
      </button>
      <button className="btn btn-sm" onClick={handleClick}>
        Save PDF
      </button>
      <div>
        <label htmlFor="term-select">Select Term</label>
        <select
          name="term-select"
          className="select select-bordered w-full max-w-xs ml-4"
          onChange={handleTermChange}
        >
          <option value={1}>Term 1</option>
          <option value={2}>Term 2</option>
          <option value={3}>Term 3</option>
        </select>
      </div>
      <div className="overflow-x-auto mt-6" id="register-table">
        <table className="table table-xs border border-1 border-gray-800">
          <thead>
            <tr className="border border-1 border-gray-800 bg-gray-300">
              <th className="border border-1 border-gray-800">First Name</th>
              <th className="border border-1 border-gray-800">Last Name</th>
              <th className="border border-1 border-gray-800">Age</th>
              <th className="border border-1 border-gray-800">Teacher</th>
              {filteredDates?.map((date) => (
                <th
                  key={date.date.toString()}
                  className="border border-1 border-gray-800 text-center"
                >
                  {date.type === "break"
                    ? "Break"
                    : `${date.date.getUTCDate()}/${
                        date.date.getUTCMonth() + 1
                      }`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {classInformation?.class_students
              ?.map((student) => findStudent(Number(student)))
              .filter(
                (studentInfo): studentInfo is StudentRecord =>
                  studentInfo !== undefined
              )
              .sort((a, b) => a.last_name.localeCompare(b.last_name))
              .map((studentInfo) => {
                return (
                  <tr
                    key={studentInfo.id}
                    className="text-center border border-1 border-gray-800"
                  >
                    <td className="border border-1 border-gray-800 bg-gray-100">
                      {studentInfo?.first_name || ""}
                    </td>
                    <td className="border border-1 border-gray-800">
                      {studentInfo?.last_name || ""}
                    </td>
                    <td className="border border-1 border-gray-800">
                      {getAge(studentInfo?.birthdate, currentDate.toString())}
                    </td>
                    <td className="border border-1 border-gray-800">
                      {findTeacher(studentInfo?.teacher_id)
                        ?.teacher_last_name || ""}
                    </td>
                    {filteredDates?.map((date) => (
                      <td
                        key={date?.date.toString()}
                        className="border border-1 border-gray-800"
                      ></td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Register;
