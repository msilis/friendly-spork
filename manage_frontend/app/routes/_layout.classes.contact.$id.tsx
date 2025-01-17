import { useNavigate, useParams, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { useClassContext } from "~/contexts/classContext";
import { getFamilies } from "~/data/data";
import { TeacherRecord, StudentRecord, FamilyRecord } from "~/types/types";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

export const loader = async () => {
  const families = await getFamilies();
  return Response.json(families);
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

  const handleSaveClick = async () => {
    const contactSheet = document.getElementById("class_contact_sheet");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [842, 595],
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    if (!contactSheet) {
      console.error("Element not found");
      return;
    }

    const canvas = await html2canvas(contactSheet, { scale: 2 });
    const tableData = canvas.toDataURL("image/png");

    const elementWidth = canvas.width - 10;
    const elementHeight = canvas.height;
    const scaleX = pageWidth / elementWidth;
    const scaleY = pageHeight / elementHeight;
    const scale = Math.min(scaleX, scaleY);

    const tableWidth = elementWidth * scale;
    const tableHeight = elementHeight * scale;

    // the add image has the following format: (imageToAdd, imageType, xOffset, yOffset, imageWidth, imageHeight)
    pdf.addImage(tableData, "PNG", 5, 20, tableWidth, tableHeight);
    pdf.save(`${classInformation.class_name}.pdf`);
  };

  return (
    <div>
      <h2>Contact Sheet</h2>
      <button className="btn btn-link" onClick={handleBackClick}>
        Back
      </button>
      <button className="btn btn-sm" onClick={handleSaveClick}>
        Save PDF
      </button>
      <div id="class_contact_sheet">
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

        <div className="overflow-x-auto mr-6">
          <table className="table table-xs border border-1 border-gray-800">
            <thead>
              <tr className="border border-1 border-gray-800 bg-gray-300">
                <th className="border border-1 border-gray-800">First name</th>
                <th className="border border-1 border-gray-800">Last Name</th>
                <th
                  className="border border-1 border-gray-800"
                  style={{ width: "100px" }}
                >
                  Birthday
                </th>
                <th className="border border-1 border-gray-800">Teacher</th>
                <th className="border border-1 border-gray-800">
                  Parent 1 First Name
                </th>
                <th className="border border-1 border-gray-800">
                  Parent 1 Last Name
                </th>
                <th className="border border-1 border-gray-800">
                  Parent 1 Email
                </th>
                <th className="border border-1 border-gray-800">
                  Parent 1 Mobile
                </th>
                <th className="border border-1 border-gray-800">
                  Parent 2 First Name
                </th>
                <th className="border border-1 border-gray-800">
                  Parent 2 Last Name
                </th>
                <th className="border border-1 border-gray-800">
                  Parent 2 Email
                </th>
                <th className="border border-1 border-gray-800">
                  Parent 2 Mobile
                </th>
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
                        {studentInfo?.birthdate || ""}
                      </td>
                      <td className="border border-1 border-gray-800">
                        {findTeacher(studentInfo?.teacher_id)
                          ?.teacher_last_name || ""}
                      </td>
                      <td className="border border-1 border-gray-800">
                        {findFamily(studentInfo?.family_id)
                          ?.parent1_first_name || ""}
                      </td>
                      <td className="border border-1 border-gray-800">
                        {findFamily(studentInfo?.family_id)
                          ?.parent1_last_name || ""}
                      </td>
                      <td className="border border-1 border-gray-800">
                        {findFamily(studentInfo?.family_id)?.parent1_email ||
                          ""}
                      </td>
                      <td className="border border-1 border-gray-800">
                        {findFamily(studentInfo?.family_id)
                          ?.parent1_mobile_phone || ""}
                      </td>
                      <td className="border border-1 border-gray-800">
                        {findFamily(studentInfo?.family_id)
                          ?.parent2_first_name || ""}
                      </td>
                      <td className="border border-1 border-gray-800">
                        {findFamily(studentInfo?.family_id)
                          ?.parent2_last_name || ""}
                      </td>
                      <td className="border border-1 border-gray-800">
                        {findFamily(studentInfo?.family_id)?.parent2_email ||
                          ""}
                      </td>
                      <td className="border border-1 border-gray-800">
                        {findFamily(studentInfo?.family_id)
                          ?.parent2_mobile_phone || ""}
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
