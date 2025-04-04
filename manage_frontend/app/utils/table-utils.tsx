import { StudentRecord, FamilyRecord, TeacherRecord } from "~/types/types";

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
