import {
  StudentRecord,
  FamilyRecord,
  TeacherRecord,
  ClassRecord,
} from "~/types/types";

export const generateStudentTable = (
  studentData: StudentRecord[],
  teacherData: TeacherRecord[],
  familyData: FamilyRecord[],
  tableId: string
) => {
  const getFamilyLastName = (student: StudentRecord) => {
    const name =
      familyData.find((family: FamilyRecord) => family.id === student.family_id)
        ?.family_last_name || "Not assigned";

    return name;
  };

  const getTeacherLastName = (student: StudentRecord) => {
    const name =
      teacherData.find(
        (teacher: TeacherRecord) => teacher.id === student.teacher_id
      )?.teacher_last_name || "Not assigned";
    return name;
  };

  const getAge = (birthDate: string, currentDate: string) => {
    const dateOne: Date = new Date(birthDate);
    const dateTwo: Date = new Date(currentDate);

    const years = dateTwo.getFullYear() - dateOne.getFullYear();
    return years;
  };

  const currentDate = new Date();
  return (
    <div className="overflow-x-auto mt-6 mr-16" id={tableId}>
      <div className="flex mb-4 text-lg justify-center">
        <h2>Student Report</h2>
      </div>
      <table className="table table-xs border border-1 border-gray-800">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Birthdate</th>
            <th>Age</th>
            <th>Family</th>
            <th>Teacher</th>
          </tr>
        </thead>
        <tbody>
          {studentData?.map((student: StudentRecord) => {
            return (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.first_name}</td>
                <td>{student.last_name}</td>
                <td>{student.birthdate}</td>
                <td>{getAge(student.birthdate, currentDate.toString())}</td>
                <td>{getFamilyLastName(student)}</td>
                <td>{getTeacherLastName(student)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const generateTeacherTable = (
  teacherData: TeacherRecord[],
  tableId: string
) => {
  return (
    <div className="overflow-x-auto mt-6 mr-16" id={tableId}>
      <div className="flex mb-4 text-lg justify-center">
        <h2>Teacher Report</h2>
      </div>
      <table className="table table-xs border border-1 border-gray-800">
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
          {teacherData?.map((teacher: TeacherRecord) => {
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
  );
};

export const generateFamilyTable = (
  familyData: FamilyRecord[],
  tableId: string
) => {
  return (
    <div className="overflow-x-auto mt-6 mr-16" id={tableId}>
      <div className="flex mb-4 text-lg justify-center">
        <h2>Family Report</h2>
      </div>
      <table className="table table-xs border border-1 border-gray-800">
        <thead>
          <tr>
            <th>ID</th>
            <th>Family Last Name</th>
            <th>Parent 1 First Name</th>
            <th>Parent 1 Last Name</th>
            <th>Parent 2 First Name</th>
            <th>Parent 2 Last Name</th>
          </tr>
        </thead>
        <tbody>
          {familyData.map((family: FamilyRecord) => {
            return (
              <tr key={family.id}>
                <td>{family.id}</td>
                <td>{family.family_last_name}</td>
                <td>{family.parent1_first_name}</td>
                <td>{family.parent1_last_name}</td>
                <td>{family.parent2_first_name}</td>
                <td>{family.parent2_last_name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const generateClassTable = (
  classData: ClassRecord[],
  teacherData: TeacherRecord[],
  studentData: StudentRecord[],
  tableId: string
) => {
  const findStudent = (id: number | undefined) => {
    const student = studentData?.find(
      (student: StudentRecord) => student.id === id
    );
    return student;
  };
  const getAge = (birthDate: string, currentDate: string) => {
    const dateOne: Date = new Date(birthDate);
    const dateTwo: Date = new Date(currentDate);

    const years = dateTwo.getFullYear() - dateOne.getFullYear();
    return years;
  };

  const findTeacher = (id: number | undefined) => {
    const teacher = teacherData?.find(
      (teacher: TeacherRecord) => teacher.id === id
    );
    return teacher;
  };

  const currentDate = new Date();

  return (
    <div id={tableId}>
      <h2 className="text-xl font-bold">Class Reports</h2>
      {classData?.map((classItem: ClassRecord) => {
        return (
          <div
            className="overflow-x-auto mt-6 mr-16"
            id={tableId}
            key={`${classItem.id}`}
          >
            <div className="flex mb-4 text-lg justify-center flex-col">
              <h2>{`${classItem.class_name} - Report`}</h2>
              <table className="table table-xs border border-1 border-gray-800">
                <thead>
                  <tr className="border border-1 border-gray-800 ">
                    <th className="border border-1 border-gray-800">
                      First Name
                    </th>
                    <th className="border border-1 border-gray-800">
                      Last Name
                    </th>
                    <th className="border border-1 border-gray-800">Age</th>
                    <th className="border border-1 border-gray-800">Teacher</th>
                  </tr>
                </thead>
                <tbody>
                  {classItem?.class_students
                    .map((classStudent) => findStudent(Number(classStudent)))
                    .filter((student) => student !== undefined)
                    .sort((a, b) => a.last_name.localeCompare(b.last_name))
                    .map((student: StudentRecord) => {
                      return (
                        <tr
                          key={student.id}
                          className=" border border-1 border-gray-800"
                        >
                          <td className="border text-left border-1 border-gray-800 ">
                            {student?.first_name || ""}
                          </td>
                          <td className="border text-left border-1 border-gray-800">
                            {student?.last_name || ""}
                          </td>
                          <td className="border text-left border-1 border-gray-800">
                            {getAge(student?.birthdate, currentDate.toString())}
                          </td>
                          <td className="border text-left border-1 border-gray-800">
                            {findTeacher(student?.teacher_id)
                              ?.teacher_last_name || ""}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};
