import { json } from "@remix-run/react";

import { FamilyRecord, StudentRecord, TeacherRecord } from "~/types/types";

export const getStudents = async () => {
  const allStudents = await fetch(
    `${process.env.MANAGE_BACKEND}/students`
  ).then((response) => response.json());
  return allStudents;
};

export const getStudent = async (params: string | undefined) => {
  const getStudent = await fetch(
    `${process.env.MANAGE_BACKEND}/students/${params}/edit`
  ).then((response) => response.json());
  return getStudent;
};

export const addStudent = async (data: StudentRecord) => {
  try {
    const addStudent = await fetch(
      `${process.env.MANAGE_BACKEND}/students/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((response) => response.json());
    return json(addStudent);
  } catch (error) {
    console.error(error, "Error adding student");
  }
};

export const updateStudent = async (
  data: StudentRecord,
  params: string | undefined
) => {
  try {
    const updateStudent = await fetch(
      `http://localhost:3000/students/${params}/edit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((response) => response.json());
    return updateStudent;
  } catch (error) {
    console.error(error, "Error updating student");
  }
};

export const getFamilies = async () => {
  const allFamilies = await fetch(
    `${process.env.MANAGE_BACKEND}/families`
  ).then((response) => response.json());
  return allFamilies;
};

export const getFamily = async (params: string | undefined) => {
  const family = await fetch(
    `${process.env.MANAGE_BACKEND}/families/${params}`
  ).then((response) => response.json());
  return family;
};

export const addFamily = async (data: FamilyRecord) => {
  try {
    const addFamily = await fetch(
      `${process.env.MANAGE_BACKEND}/families/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((response) => response.json());
    return json(addFamily);
  } catch (error) {
    console.error(error, "Error adding family");
  }
};

export const updateFamily = async (
  data: FamilyRecord,
  id: string | undefined
) => {
  try {
    const updateTeacher = await fetch(
      `http://localhost:3000/families/${id}/edit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((response) => response.json());
    return updateTeacher;
  } catch (error) {
    console.error(error, "There was an error updating the family record.");
  }
};

export const getTeachers = async () => {
  const allTeachers = await fetch(
    `${process.env.MANAGE_BACKEND}/teachers`
  ).then((response) => response.json());
  return allTeachers;
};

export const getTeacher = async (params: string | undefined) => {
  const teacher = await fetch(
    `${process.env.MANAGE_BACKEND}/teachers/${params}/edit`
  ).then((response) => response.json());
  return teacher;
};

export const addTeacher = async (data: TeacherRecord) => {
  try {
    const addTeacher = await fetch(
      `${process.env.MANAGE_BACKEND}/teachers/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((response) => response.json());
    return json(addTeacher);
  } catch (error) {
    console.error(error, "Error adding teacher");
  }
};

export const updateTeacher = async (
  data: TeacherRecord,
  params: string | undefined
) => {
  try {
    const updateTeacher = await fetch(
      `http://localhost:3000/teachers/${params}/edit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((response) => response.json());
    return updateTeacher;
  } catch (error) {
    console.error(error, "Error updating teacher");
  }
};
