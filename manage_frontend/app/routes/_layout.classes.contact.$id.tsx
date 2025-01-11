import { useNavigate, useParams, useLoaderData, json } from "@remix-run/react";
import { useEffect } from "react";
import { useClassContext } from "~/contexts/classContext";
import { getFamilies } from "~/data/data";
import { TeacherRecord, StudentRecord, FamilyRecord } from "~/types/types";

export const loader = async () => {
  const families = await getFamilies();
  return json(families);
};

const ContactSheet = () => {
  const families = useLoaderData<typeof loader>();
  const params = useParams();
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(`/classes/${params.id}`);
  };

  const {
    classInformation,
    studentInformation,
    teacherInformation,
    setClassInformation,
    setStudentInformation,
    setTeacherInformation,
  } = useClassContext();

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

  const findFamily = (familyId: number | undefined) => {
    const family = families?.find(
      (family: FamilyRecord) => family.id === familyId
    );
    return family;
  };

  if (!classInformation) return <div>Loading</div>;

  return (
    <div>
      <h2>Contact Sheet</h2>
      <button className="btn btn-link" onClick={handleBackClick}>
        Back
      </button>
      <div>
        <div className="flex mb-4 text-lg gap-2 justify-center">
          <h2>
            {classInformation?.class_name}
            {" - "}
          </h2>
          <h2>
            {findTeacher(classInformation?.class_teacher)?.teacher_first_name}
            {" & "}
            {
              findTeacher(classInformation?.class_accompanist)
                ?.teacher_first_name
            }
            {" -"}
          </h2>
          <h2>
            {classInformation?.class_start_time} to{" "}
            {classInformation?.class_end_time} {" - "}
          </h2>
          <h2>{classInformation?.class_location}</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="table-xs">
            <thead>
              <tr>
                <th>First name</th>
                <th>Last Name</th>
                <th>Birthday</th>
                <th>Teacher</th>
                <th>Parent 1 First Name</th>
                <th>Parent 1 Last Name</th>
                <th>Parent 1 Email</th>
                <th>Parent 1 Mobile</th>
                <th>Parent 2 First Name</th>
                <th>Parent 2 Last Name</th>
                <th>Parent 2 Email</th>
                <th>Parent 2 Mobile</th>
              </tr>
            </thead>
            <tbody>
              {classInformation?.class_students?.map((student) => {
                const studentInfo: StudentRecord = findStudent(Number(student));
                return (
                  <tr key={student}>
                    <td>{studentInfo.first_name}</td>
                    <td>{studentInfo.last_name}</td>
                    <td>{studentInfo.birthdate}</td>
                    <td>
                      {findTeacher(studentInfo?.teacher_id)?.teacher_last_name}
                    </td>
                    <td>
                      {findFamily(studentInfo?.family_id)?.parent1_first_name}
                    </td>
                    <td>
                      {findFamily(studentInfo?.family_id)?.parent1_last_name}
                    </td>
                    <td>{findFamily(studentInfo?.family_id)?.parent1_email}</td>
                    <td>
                      {findFamily(studentInfo?.family_id)?.parent1_mobile_phone}
                    </td>
                    <td>
                      {findFamily(studentInfo?.family_id)?.parent2_first_name}
                    </td>
                    <td>
                      {findFamily(studentInfo?.family_id)?.parent2_last_name}
                    </td>
                    <td>{findFamily(studentInfo?.family_id)?.parent2_email}</td>
                    <td>
                      {findFamily(studentInfo?.family_id)?.parent2_mobile_phone}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactSheet;
